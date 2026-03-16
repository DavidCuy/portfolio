"""
Test de publicación — Lambda: Sanity Webhook → Plataforma de publicación
=========================================================================

Ejecución:
  cd external/
  pip install python-dotenv pytest
  python -m pytest test_lambda.py -v -s
"""

import importlib.util
import json
import os
import sys

from dotenv import load_dotenv

_HERE = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(_HERE, ".env"))
sys.path.insert(0, _HERE)


def _load_lambda():
    path = os.path.join(_HERE, "lambda_function.py")
    spec = importlib.util.spec_from_file_location("lambda_module", path)
    mod = importlib.util.module_from_spec(spec)
    sys.modules["lambda_module"] = mod
    spec.loader.exec_module(mod)
    return mod


_lambda_mod = _load_lambda()
lambda_handler = _lambda_mod.lambda_handler

REAL_EVENT = {
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


def test_publish():
    response = lambda_handler(REAL_EVENT, None)
    body = json.loads(response["body"])

    print(f"\nStatus: {response['statusCode']}")
    print(f"Body:   {json.dumps(body, indent=2, ensure_ascii=False)}")

    assert response["statusCode"] in (200, 207), f"Error inesperado: {body}"

    results = body.get("results", [])
    for result in results:
        if "error" not in result:
            print(f"✓ [{result['platform']}] {result['action']} → {result.get('url')}")
        else:
            print(f"✗ [{result['platform']}] {result['error']}")
