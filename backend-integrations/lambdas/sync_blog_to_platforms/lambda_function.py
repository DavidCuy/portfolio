"""
Lambda: Sanity Webhook → Plataforma de publicación
====================================================
Trigger: API Gateway POST /publish

Variables de entorno requeridas:
  PUBLISH_PLATFORM      → plataformas separadas por coma: "devto" | "devto,medium" | "devto,medium,hashnode"
  DEVTO_API_KEY         → solo si PUBLISH_PLATFORM incluye "devto"
  MEDIUM_INTEGRATION_TOKEN  → solo si PUBLISH_PLATFORM incluye "medium"
  HASHNODE_ACCESS_TOKEN     → solo si PUBLISH_PLATFORM incluye "hashnode"
  HASHNODE_PUBLICATION_ID   → solo si PUBLISH_PLATFORM incluye "hashnode"
  SANITY_TOKEN          → token de lectura de Sanity
  SANITY_WEBHOOK_SECRET → secret del webhook de Sanity
  BLOG_BASE_URL         → URL base del blog (ej: https://davidcuy.com/blog)
"""

from __future__ import annotations

# ---------------------------------------------------------------------------
# sys.path: permite que Lambda encuentre los módulos locales
# (adapters/ y utils/) tanto en local como en /var/task dentro de AWS.
# ---------------------------------------------------------------------------
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import base64
import json
import logging

from adapters import BlogPublisher
from utils.sanity_client import fetch_post_from_sanity, verify_sanity_signature

logger = logging.getLogger()
logger.setLevel(logging.INFO)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _response(status_code: int, body: dict) -> dict:
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body),
    }


def _build_publisher(platform: str) -> BlogPublisher:
    """Instancia un BlogPublisher para la plataforma dada leyendo credenciales del entorno."""
    if platform == "devto":
        api_key = os.environ.get("DEVTO_API_KEY", "")
        if not api_key:
            raise EnvironmentError("Falta variable de entorno: DEVTO_API_KEY")
        return BlogPublisher("devto", api_key=api_key)

    if platform == "medium":
        token = os.environ.get("MEDIUM_INTEGRATION_TOKEN", "")
        if not token:
            raise EnvironmentError("Falta variable de entorno: MEDIUM_INTEGRATION_TOKEN")
        return BlogPublisher("medium", integration_token=token)

    if platform == "hashnode":
        token = os.environ.get("HASHNODE_ACCESS_TOKEN", "")
        pub_id = os.environ.get("HASHNODE_PUBLICATION_ID", "")
        if not token or not pub_id:
            raise EnvironmentError(
                "Faltan variables de entorno: HASHNODE_ACCESS_TOKEN, HASHNODE_PUBLICATION_ID"
            )
        return BlogPublisher("hashnode", access_token=token, publication_id=pub_id)

    raise ValueError(f"Plataforma no reconocida: '{platform}'")


def _parse_platforms(raw: str) -> list[str]:
    """
    Convierte la variable PUBLISH_PLATFORM en una lista de plataformas únicas.
    Ejemplos:
      "devto"                  → ["devto"]
      "devto,medium"           → ["devto", "medium"]
      "devto , medium,devto"   → ["devto", "medium"]  (deduplicado, orden preservado)
    """
    seen: set[str] = set()
    result: list[str] = []
    for p in raw.split(","):
        name = p.strip().lower()
        if name and name not in seen:
            seen.add(name)
            result.append(name)
    return result


# ---------------------------------------------------------------------------
# Handler principal
# ---------------------------------------------------------------------------

def lambda_handler(event: dict, context) -> dict:
    platforms_raw  = os.environ.get("PUBLISH_PLATFORM", "devto")
    sanity_token   = os.environ.get("SANITY_TOKEN", "")
    webhook_secret = os.environ.get("SANITY_WEBHOOK_SECRET", "")
    blog_base_url  = os.environ.get("BLOG_BASE_URL", "https://davidcuy.com/blog")

    # ── Construir publishers (falla rápido si falta alguna credencial) ─────
    platforms = _parse_platforms(platforms_raw)
    publishers: list[BlogPublisher] = []
    for platform in platforms:
        try:
            publishers.append(_build_publisher(platform))
        except (EnvironmentError, ValueError) as e:
            logger.error(str(e))
            return _response(500, {"error": "Server misconfigured", "detail": str(e)})

    # ── Body raw ───────────────────────────────────────────────────────────
    body_raw = event.get("body", "") or ""
    if event.get("isBase64Encoded"):
        body_raw = base64.b64decode(body_raw).decode("utf-8")

    # ── Validar firma del webhook ──────────────────────────────────────────
    if webhook_secret:
        signature = (event.get("headers") or {}).get("sanity-webhook-signature", "")
        if not verify_sanity_signature(body_raw.encode("utf-8"), signature, webhook_secret):
            logger.warning("Firma de webhook inválida")
            return _response(401, {"error": "Invalid webhook signature"})

    # ── Parsear payload ────────────────────────────────────────────────────
    try:
        payload = json.loads(body_raw)
    except json.JSONDecodeError:
        return _response(400, {"error": "Invalid JSON body"})

    logger.info(f"Webhook recibido: {json.dumps(payload, default=str)}")

    # ── Extraer slug ───────────────────────────────────────────────────────
    doc = payload.get("value") or payload
    slug = (doc.get("slug") or {}).get("current") or doc.get("slug")

    if not slug:
        logger.warning("No se encontró slug en el webhook payload")
        return _response(400, {"error": "Missing slug in payload"})

    doc_type = doc.get("_type")
    if doc_type and doc_type != "post":
        logger.info(f"Tipo de documento ignorado: {doc_type}")
        return _response(200, {"message": f"Document type '{doc_type}' ignored"})

    # ── Obtener post completo de Sanity ────────────────────────────────────
    logger.info(f"Obteniendo post con slug: {slug}")
    post = fetch_post_from_sanity(slug, sanity_token)

    if not post:
        logger.error(f"Post no encontrado en Sanity: {slug}")
        return _response(404, {"error": f"Post '{slug}' not found in Sanity"})

    # ── Publicar en cada plataforma, acumulando resultados ─────────────────
    results: list[dict] = []
    for publisher in publishers:
        try:
            result = publisher.publish(post, blog_base_url)
            logger.info(f"{publisher.platform}: {result}")
            results.append(result)
        except (RuntimeError, NotImplementedError) as e:
            logger.error(f"{publisher.platform}: {e}")
            results.append({"platform": publisher.platform, "error": str(e)})

    succeeded = [r for r in results if "error" not in r]
    failed    = [r for r in results if "error" in r]

    if not succeeded:
        return _response(502, {
            "message": "Failed to publish on all platforms",
            "results": results,
        })

    status_code = 200 if not failed else 207  # 207 Multi-Status si hay éxitos y fallos
    return _response(status_code, {
        "message": f"Published on {len(succeeded)}/{len(results)} platform(s)",
        "results": results,
    })
