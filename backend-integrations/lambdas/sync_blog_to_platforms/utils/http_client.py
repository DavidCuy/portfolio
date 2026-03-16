from __future__ import annotations

import json
import logging
import urllib.request
import urllib.error

logger = logging.getLogger(__name__)


def _safe_parse_json(raw: str) -> dict:
    text = raw.strip()
    if not text:
        return {"raw_response": "(empty body)"}
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {"raw_response": text}


def http_get(url: str, headers: dict) -> dict:
    req = urllib.request.Request(url, headers=headers, method="GET")
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode("utf-8"))


def http_post(url: str, headers: dict, payload: dict) -> tuple[int, dict]:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, _safe_parse_json(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        logger.error(f"HTTP {e.code} from POST {url} — body: {body!r}")
        return e.code, _safe_parse_json(body)


def http_put(url: str, headers: dict, payload: dict) -> tuple[int, dict]:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="PUT")
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, _safe_parse_json(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        logger.error(f"HTTP {e.code} from PUT {url} — body: {body!r}")
        return e.code, _safe_parse_json(body)
