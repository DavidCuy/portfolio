from __future__ import annotations

import json
import logging

from adapters.base import PublishingAdapter
from utils.http_client import http_get, http_post, http_put
from utils.portable_text import portable_text_to_markdown

logger = logging.getLogger(__name__)


class DevToAdapter(PublishingAdapter):
    """
    Adapter para Dev.to.
    Documentación: https://developers.forem.com/api

    Credenciales requeridas:
      api_key → Settings → Extensions → DEV API Keys
    """

    API_BASE = "https://dev.to/api"

    def __init__(self, api_key: str) -> None:
        self.api_key = api_key

    def _headers(self) -> dict:
        return {
            "api-key": self.api_key,
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (compatible; SanityBlogSync/1.0)",
        }

    def _find_existing(self, title: str) -> int | None:
        """Busca un artículo publicado por título exacto. Devuelve el ID o None."""
        for page in range(1, 11):
            url = f"{self.API_BASE}/articles/me/published?per_page=100&page={page}"
            try:
                articles = http_get(url, self._headers())
                if not articles:
                    break
                for article in articles:
                    if article.get("title", "").strip() == title.strip():
                        return article["id"]
            except Exception as e:
                logger.warning(f"Error buscando artículo en Dev.to (página {page}): {e}")
                break
        return None

    def render(self, post: dict, blog_base_url: str) -> dict:
        slug = post.get("slug", "")
        title = post.get("title", "")
        categories = post.get("categories") or []
        image_url = post.get("image", "")
        excerpt = post.get("excerpt", "")

        # Tags: máximo 4, solo letras/números (requisito Dev.to)
        tags = [
            c["title"].lower().replace(" ", "").replace("-", "")[:20]
            for c in categories if c.get("title")
        ][:4]

        canonical_url = f"{blog_base_url.rstrip('/')}/{slug}" if slug else ""

        markdown_body = portable_text_to_markdown(post.get("body", []))
        if image_url:
            markdown_body = f"![cover]({image_url})\n\n{markdown_body}"

        payload: dict = {
            "article": {
                "title": title,
                "published": True,
                "body_markdown": markdown_body,
                "tags": tags,
            }
        }
        if canonical_url:
            payload["article"]["canonical_url"] = canonical_url
        if excerpt:
            payload["article"]["description"] = excerpt
        if image_url:
            payload["article"]["main_image"] = image_url

        return payload

    def publish(self, post: dict, blog_base_url: str) -> dict:
        payload = self.render(post, blog_base_url)
        title = post.get("title", "")

        logger.info(f"Payload a enviar a Dev.to: {json.dumps({
            'title': payload['article'].get('title'),
            'tags': payload['article'].get('tags'),
            'canonical_url': payload['article'].get('canonical_url'),
            'published': payload['article'].get('published'),
            'body_length': len(payload['article'].get('body_markdown', '')),
        })}")

        existing_id = self._find_existing(title)

        if existing_id:
            logger.info(f"Artículo encontrado en Dev.to (id={existing_id}), actualizando...")
            status, response = http_put(
                f"{self.API_BASE}/articles/{existing_id}",
                self._headers(),
                payload,
            )
            action = "updated"
        else:
            logger.info("Artículo nuevo, publicando en Dev.to...")
            status, response = http_post(
                f"{self.API_BASE}/articles",
                self._headers(),
                payload,
            )
            action = "created"

        logger.info(f"Dev.to respuesta [{status}]: {json.dumps(response)}")

        if status not in (200, 201):
            raise RuntimeError(f"Dev.to API error [{status}]: {json.dumps(response)}")

        return {
            "action": action,
            "platform": "devto",
            "platform_id": response.get("id"),
            "url": response.get("url"),
            "title": response.get("title"),
        }
