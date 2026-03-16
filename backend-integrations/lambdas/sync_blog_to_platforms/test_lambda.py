"""
Test de publicación — Lambda: Sanity Webhook → Plataforma de publicación
=========================================================================

Ejecución:
  cd lambdas/sync_blog_to_platforms/
  pip install python-dotenv pytest
  python -m pytest test_lambda.py -v -s

  # Solo el test de Hashnode:
  python -m pytest test_lambda.py::test_hashnode_adapter -v -s
"""

import importlib.util
import json
import os
import sys
import unittest.mock

from dotenv import load_dotenv

_HERE = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(_HERE, ".env"))
sys.path.insert(0, _HERE)


# ---------------------------------------------------------------------------
# Carga del módulo Lambda
# ---------------------------------------------------------------------------

def _load_lambda():
    path = os.path.join(_HERE, "lambda_function.py")
    spec = importlib.util.spec_from_file_location("lambda_module", path)
    mod = importlib.util.module_from_spec(spec)
    sys.modules["lambda_module"] = mod
    spec.loader.exec_module(mod)
    return mod


_lambda_mod = _load_lambda()
lambda_handler = _lambda_mod.lambda_handler


# ---------------------------------------------------------------------------
# Secretos simulados desde .env (sustituye la llamada a AWS Secrets Manager)
# ---------------------------------------------------------------------------

def _secrets_from_env() -> dict:
    """Construye el dict de secretos leyendo del .env local."""
    return {
        "PUBLISH_PLATFORM":         os.environ.get("PUBLISH_PLATFORM", "devto"),
        "DEVTO_API_KEY":            os.environ.get("DEVTO_API_KEY", ""),
        "MEDIUM_INTEGRATION_TOKEN": os.environ.get("MEDIUM_INTEGRATION_TOKEN", ""),
        "HASHNODE_ACCESS_TOKEN":    os.environ.get("HASHNODE_ACCESS_TOKEN", ""),
        "HASHNODE_PUBLICATION_ID":  os.environ.get("HASHNODE_PUBLICATION_ID", ""),
        "SANITY_TOKEN":             os.environ.get("SANITY_TOKEN", ""),
        "SANITY_WEBHOOK_SECRET":    os.environ.get("SANITY_WEBHOOK_SECRET", ""),
        "BLOG_BASE_URL":            os.environ.get("BLOG_BASE_URL", "https://davidcuy.com/blog"),
    }


# ---------------------------------------------------------------------------
# Evento de webhook de Sanity (payload de ejemplo)
# ---------------------------------------------------------------------------

_WEBHOOK_EVENT = {
    "resource": "/sync-sanity-dev-to",
    "path": "/sync-sanity-dev-to",
    "httpMethod": "POST",
    "headers": {
        "content-type": "application/json",
        "sanity-dataset": "production",
        "sanity-document-id": "14ca0879-31e6-46d8-8050-def84f33806c",
        "sanity-operation": "update",
        "sanity-project-id": "my6ptkxm",
        "sanity-transaction-id": "f3B9PuFrOuEr1B8BwpsW8o",
        "sanity-transaction-time": "2026-03-13T05:29:29Z",
        "sanity-webhook-id": "ctoFxsStX90tqVYS",
        "sanity-webhook-signature": "7AMgeutlmW+vunEoVkcYSZXFsxiRmdltqpmWUQCgWeM=",
        "User-Agent": "Sanity.io webhook delivery",
    },
    "body": json.dumps({
        "_createdAt": "2026-03-13T05:01:01Z",
        "_id": "14ca0879-31e6-46d8-8050-def84f33806c",
        "_type": "post",
        "_rev": "f3B9PuFrOuEr1B8BwpsW8o",
        "_updatedAt": "2026-03-13T05:29:29Z",
        "title": "Sincronizacion de blog",
        "slug": {"_type": "slug", "current": "sync-blogs"},
        "author": {"_ref": "91c26168-707a-4ab5-8874-802c64ef4c5a", "_type": "reference"},
        "categories": [
            {"_type": "reference", "_key": "940e5fec110f", "_ref": "800dffab-2da1-4ac1-814d-50773bc12be6"},
            {"_ref": "36a2a893-3096-43cf-8588-00e5a9167be3", "_type": "reference", "_key": "bb50bc4fb9a7"},
        ],
        "mainImage": {
            "_type": "image",
            "asset": {"_ref": "image-9d13dc1efcb777fb49b96bee3037d01ad6284260-1376x768-png", "_type": "reference"},
        },
        "body": [
            {
                "_type": "block",
                "style": "normal",
                "_key": "81dbf77f5cf2",
                "children": [{"_key": "a58b1ce7f2e4", "text": "Texto del post.", "_type": "span", "marks": []}],
                "markDefs": [],
            }
        ],
    }),
    "isBase64Encoded": False,
}

# Post de ejemplo con campos resueltos (como lo devuelve Sanity)
_SAMPLE_POST = {
    "title": "Sincronizacion de blog",
    "slug": "sync-blogs",
    "excerpt": "Post de prueba para verificar la integración con la plataforma.",
    "image": "https://cdn.sanity.io/images/my6ptkxm/production/example.png",
    "date": "2026-03-13T05:01:01Z",
    "categories": [
        {"title": "DevOps"},
        {"title": "Python"},
    ],
    "body": [
        {
            "_type": "block",
            "style": "h2",
            "_key": "h1",
            "children": [{"_key": "s1", "text": "Introducción", "_type": "span", "marks": []}],
            "markDefs": [],
        },
        {
            "_type": "block",
            "style": "normal",
            "_key": "p1",
            "children": [{"_key": "s2", "text": "Este es un post de prueba generado desde el test de integración.", "_type": "span", "marks": []}],
            "markDefs": [],
        },
    ],
}


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

def test_publish():
    """
    Test de integración completo a través del handler de la Lambda.
    Sustituye la llamada a AWS Secrets Manager con los valores del .env.
    La plataforma usada es la que esté en PUBLISH_PLATFORM del .env.
    """
    with unittest.mock.patch.object(_lambda_mod, "_load_secrets", return_value=_secrets_from_env()):
        _lambda_mod._secrets_cache = None  # forzar re-lectura en warm starts
        response = lambda_handler(_WEBHOOK_EVENT, None)

    body = json.loads(response["body"])

    print(f"\nStatus: {response['statusCode']}")
    print(f"Body:   {json.dumps(body, indent=2, ensure_ascii=False)}")

    assert response["statusCode"] in (200, 207), f"Error inesperado: {body}"

    for result in body.get("results", []):
        if "error" not in result:
            print(f"✓ [{result['platform']}] {result['action']} → {result.get('url')}")
        else:
            print(f"✗ [{result['platform']}] {result['error']}")


def test_hashnode_adapter():
    """
    Test de integración directo del HashnodeAdapter.
    Requiere HASHNODE_ACCESS_TOKEN y HASHNODE_PUBLICATION_ID en .env.
    Publica (o actualiza) el post de ejemplo y verifica la respuesta.
    """
    import pytest
    from adapters.hashnode import HashnodeAdapter

    access_token   = os.environ.get("HASHNODE_ACCESS_TOKEN", "")
    publication_id = os.environ.get("HASHNODE_PUBLICATION_ID", "")
    blog_base_url  = os.environ.get("BLOG_BASE_URL", "https://davidcuy.com/blog")

    if not access_token or access_token == "your_hashnode_access_token_here":
        pytest.skip("HASHNODE_ACCESS_TOKEN no configurado en .env")
    if not publication_id or publication_id == "your_hashnode_publication_id_here":
        pytest.skip("HASHNODE_PUBLICATION_ID no configurado en .env")

    adapter = HashnodeAdapter(access_token=access_token, publication_id=publication_id)
    result  = adapter.publish(_SAMPLE_POST, blog_base_url)

    print(f"\nHashnode resultado: {json.dumps(result, indent=2, ensure_ascii=False)}")

    assert result["platform"] == "hashnode"
    assert result["action"] in ("created", "updated"), f"Acción inesperada: {result['action']}"
    assert result.get("platform_id"), "No se recibió ID del post"
    assert result.get("url"),         "No se recibió URL del post"
    assert result.get("title") == _SAMPLE_POST["title"], "El título no coincide"

    print(f"\n✓ [{result['action'].upper()}] {result['title']} → {result['url']}")
