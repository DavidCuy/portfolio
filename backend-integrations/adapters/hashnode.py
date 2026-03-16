from __future__ import annotations

from adapters.base import PublishingAdapter


class HashnodeAdapter(PublishingAdapter):
    """
    Adapter para Hashnode.
    Documentación: https://apidocs.hashnode.com (GraphQL API)

    Credenciales requeridas:
      access_token    → Account Settings → Developer → Access Tokens
      publication_id  → ID de tu publicación en Hashnode

    Mutation GraphQL: publishPost
      https://apidocs.hashnode.com/#mutation-publishPost
    """

    def __init__(self, access_token: str, publication_id: str) -> None:
        self.access_token = access_token
        self.publication_id = publication_id

    def render(self, post: dict, blog_base_url: str) -> dict:
        # TODO: implementar mutation GraphQL publishPost
        raise NotImplementedError("HashnodeAdapter.render no implementado aún")

    def publish(self, post: dict, blog_base_url: str) -> dict:
        # TODO: implementar
        raise NotImplementedError("HashnodeAdapter.publish no implementado aún")
