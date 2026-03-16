from __future__ import annotations

from abc import ABC, abstractmethod


class PublishingAdapter(ABC):
    """
    Interfaz que deben implementar todos los adapters de plataforma.

    render()  → construye el payload listo para enviar a la API destino.
    publish() → orquesta render + llamada HTTP y devuelve metadatos del resultado.
    """

    @abstractmethod
    def render(self, post: dict, blog_base_url: str) -> dict:
        """Construye el payload listo para enviar a la API de la plataforma."""

    @abstractmethod
    def publish(self, post: dict, blog_base_url: str) -> dict:
        """
        Publica o actualiza el post en la plataforma.
        Devuelve un dict con al menos: action, platform, platform_id, url, title.
        """


class BlogPublisher:
    """
    Punto de entrada único para publicar un post de Sanity en cualquier plataforma.

    Uso:
        publisher = BlogPublisher("devto", api_key="xxx")
        payload   = publisher.render(post, blog_base_url)
        result    = publisher.publish(post, blog_base_url)

    Para registrar un adapter externo en runtime:
        BlogPublisher.register("mi-plataforma", MiAdapter)
    """

    # Importaciones diferidas para evitar importaciones circulares en el __init__
    @classmethod
    def _default_registry(cls) -> dict[str, type[PublishingAdapter]]:
        from adapters.devto import DevToAdapter
        from adapters.medium import MediumAdapter
        from adapters.hashnode import HashnodeAdapter
        return {
            "devto": DevToAdapter,
            "medium": MediumAdapter,
            "hashnode": HashnodeAdapter,
        }

    _registry: dict[str, type[PublishingAdapter]] = {}

    def __init__(self, platform: str, **adapter_kwargs) -> None:
        if not self._registry:
            self._registry.update(self._default_registry())

        platform = platform.lower()
        if platform not in self._registry:
            raise ValueError(
                f"Plataforma '{platform}' no registrada. "
                f"Opciones: {list(self._registry)}"
            )
        self.platform = platform
        self._adapter: PublishingAdapter = self._registry[platform](**adapter_kwargs)

    @classmethod
    def register(cls, name: str, adapter_class: type[PublishingAdapter]) -> None:
        """Registra un adapter de terceros en tiempo de ejecución."""
        cls._registry[name.lower()] = adapter_class

    def render(self, post: dict, blog_base_url: str) -> dict:
        """Devuelve el payload listo para la API destino (sin publicar)."""
        return self._adapter.render(post, blog_base_url)

    def publish(self, post: dict, blog_base_url: str) -> dict:
        """Publica o actualiza el post. Devuelve metadatos del resultado."""
        return self._adapter.publish(post, blog_base_url)
