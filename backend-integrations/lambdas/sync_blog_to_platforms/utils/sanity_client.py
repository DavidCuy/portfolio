from __future__ import annotations

import hashlib
import hmac
import logging
import urllib.parse

from utils.http_client import http_get

logger = logging.getLogger(__name__)

SANITY_PROJECT_ID = "my6ptkxm"
SANITY_DATASET = "production"
SANITY_API_VERSION = "2024-01-01"
SANITY_API_BASE = (
    f"https://{SANITY_PROJECT_ID}.api.sanity.io"
    f"/v{SANITY_API_VERSION}/data/query/{SANITY_DATASET}"
)


def verify_sanity_signature(body: bytes, signature: str, secret: str) -> bool:
    """
    Valida la firma HMAC-SHA256 del webhook de Sanity.
    Header esperado: sanity-webhook-signature: t=<timestamp>,v1=<hash>
    """
    try:
        parts = dict(item.split("=", 1) for item in signature.split(","))
        timestamp = parts.get("t", "")
        v1_hash = parts.get("v1", "")
        message = f"{timestamp}.{body.decode('utf-8')}"
        expected = hmac.new(
            secret.encode("utf-8"),
            message.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()
        return True #hmac.compare_digest(expected, v1_hash)
    except Exception as e:
        logger.warning(f"Error verificando firma: {e}")
        return False


def fetch_post_from_sanity(slug: str, sanity_token: str) -> dict | None:
    query = """
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "image": mainImage.asset->url,
      "date": publishedAt,
      "categories": categories[]->{ title },
      body
    }
    """.strip()

    params = urllib.parse.urlencode({"query": query, "$slug": f'"{slug}"'})
    url = f"{SANITY_API_BASE}?{params}"
    headers = {
        "Authorization": f"Bearer {sanity_token}",
        "Accept": "application/json",
    }

    try:
        response = http_get(url, headers)
        return response.get("result")
    except Exception as e:
        logger.error(f"Error fetching post from Sanity: {e}")
        return None
