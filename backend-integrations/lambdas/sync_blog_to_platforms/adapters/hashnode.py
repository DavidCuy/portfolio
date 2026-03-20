from __future__ import annotations

import json
import logging

from adapters.base import PublishingAdapter
from utils.http_client import http_post
from utils.portable_text import portable_text_to_markdown

logger = logging.getLogger(__name__)

_HASHNODE_GQL = "https://gql.hashnode.com"

_MUTATION_PUBLISH = """
mutation PublishPost($input: PublishPostInput!) {
  publishPost(input: $input) {
    post {
      id
      url
      title
      slug
    }
  }
}
"""

_MUTATION_UPDATE = """
mutation UpdatePost($input: UpdatePostInput!) {
  updatePost(input: $input) {
    post {
      id
      url
      title
      slug
    }
  }
}
"""

_QUERY_GET_POST = """
query GetPost($publicationId: ObjectId!, $slug: String!) {
  publication(id: $publicationId) {
    post(slug: $slug) {
      id
    }
  }
}
"""


class HashnodeAdapter(PublishingAdapter):
    """
    Adapter para Hashnode (GraphQL API).
    Documentación: https://apidocs.hashnode.com

    Credenciales requeridas:
      access_token    → Account Settings → Developer → Access Tokens
      publication_id  → ID de tu publicación en Hashnode
    """

    def __init__(self, access_token: str, publication_id: str) -> None:
        self.access_token = access_token
        self.publication_id = publication_id

    def _headers(self) -> dict:
        return {
            "Authorization": self.access_token,
            "Content-Type": "application/json",
        }

    def _gql(self, query: str, variables: dict) -> dict:
        """Ejecuta una query o mutation GraphQL contra la API de Hashnode."""
        status, response = http_post(
            _HASHNODE_GQL,
            self._headers(),
            {"query": query, "variables": variables},
        )
        if status != 200:
            raise RuntimeError(f"Hashnode GQL error [{status}]: {json.dumps(response)}")
        errors = response.get("errors")
        if errors:
            raise RuntimeError(f"Hashnode GQL errors: {json.dumps(errors)}")
        return response.get("data", {})

    def _find_existing_post(self, slug: str) -> str | None:
        """
        Busca un post por slug en la publicación.
        Devuelve el ID del post si existe, o None.
        """
        try:
            data = self._gql(_QUERY_GET_POST, {
                "publicationId": self.publication_id,
                "slug": slug,
            })
            return ((data.get("publication") or {}).get("post") or {}).get("id")
        except Exception as e:
            logger.warning(f"Error buscando post en Hashnode (slug={slug!r}): {e}")
            return None

    def render(self, post: dict, blog_base_url: str) -> dict:
        """
        Construye el input para PublishPostInput / UpdatePostInput.
        Los campos opcionales solo se incluyen si tienen valor.
        """
        slug = post.get("slug", "")
        title = post.get("title", "")
        image_url = post.get("image", "")
        excerpt = post.get("excerpt", "")
        published_at = post.get("date", "")

        canonical_url = f"{blog_base_url.rstrip('/')}/{slug}" if slug else ""
        markdown_body = portable_text_to_markdown(post.get("body", []))

        payload: dict = {
            "title": title,
            "publicationId": self.publication_id,
            "contentMarkdown": markdown_body,
        }
        if slug:
            payload["slug"] = slug
        if canonical_url:
            payload["originalArticleURL"] = canonical_url
        if excerpt:
            payload["subtitle"] = excerpt
        if image_url:
            payload["coverImageOptions"] = {"coverImageURL": image_url}
        if published_at:
            payload["publishedAt"] = published_at

        return payload

    def publish(self, post: dict, blog_base_url: str) -> dict:
        input_data = self.render(post, blog_base_url)
        slug = post.get("slug", "")
        title = post.get("title", "")

        logger.info(f"Payload a enviar a Hashnode: {json.dumps({
            'title': input_data.get('title'),
            'slug': input_data.get('slug'),
            'canonical_url': input_data.get('originalArticleURL'),
            'has_cover': bool(input_data.get('coverImageOptions')),
            'body_length': len(input_data.get('contentMarkdown', '')),
        })}")

        existing_id = self._find_existing_post(slug) if slug else None

        if existing_id:
            logger.info(f"Post encontrado en Hashnode (id={existing_id}), actualizando...")
            # updatePost no acepta publicationId ni publishedAt
            update_input = {
                k: v for k, v in input_data.items()
                if k not in ("publicationId", "publishedAt")
            }
            update_input["id"] = existing_id
            data = self._gql(_MUTATION_UPDATE, {"input": update_input})
            post_data = (data.get("updatePost") or {}).get("post") or {}
            action = "updated"
        else:
            logger.info(f"Post nuevo, publicando en Hashnode: {title!r}")
            data = self._gql(_MUTATION_PUBLISH, {"input": input_data})
            post_data = (data.get("publishPost") or {}).get("post") or {}
            action = "created"

        logger.info(f"Hashnode respuesta: {json.dumps(post_data)}")

        if not post_data.get("id"):
            raise RuntimeError(f"Hashnode no devolvió ID del post. Respuesta: {json.dumps(data)}")

        return {
            "action": action,
            "platform": "hashnode",
            "platform_id": post_data.get("id"),
            "url": post_data.get("url"),
            "title": post_data.get("title"),
        }
