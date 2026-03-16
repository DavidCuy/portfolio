from __future__ import annotations

from adapters.base import PublishingAdapter


class MediumAdapter(PublishingAdapter):
    """
    Adapter para Medium.
    Documentación: https://github.com/Medium/medium-api-docs

    Credenciales requeridas:
      integration_token → Settings → Security and apps → Integration tokens

    Endpoint:
      POST https://api.medium.com/v1/users/{authorId}/posts
      Campos: title, contentFormat ("markdown"), content, tags, canonicalUrl, publishStatus
    """

    def __init__(self, integration_token: str) -> None:
        self.integration_token = integration_token

    def render(self, post: dict, blog_base_url: str) -> dict:
        # TODO: implementar
        raise NotImplementedError("MediumAdapter.render no implementado aún")

    def publish(self, post: dict, blog_base_url: str) -> dict:
        # TODO: implementar
        raise NotImplementedError("MediumAdapter.publish no implementado aún")
