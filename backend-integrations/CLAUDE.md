# CLAUDE.md — Backend Integrations (sync-personal-blog)

Archivo de contexto para herramientas de IA. Describe la arquitectura, convenciones y decisiones técnicas de este subproyecto.

---

## Propósito

Infraestructura AWS para el portafolio personal de David Cuy. Automatiza la **sincronización del blog**: cuando se publica un post en Sanity CMS, un webhook dispara una Lambda que lo republica en plataformas externas (Dev.to, Hashnode, Medium).

---

## Stack tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| Python | 3.11+ | Lenguaje principal |
| Pulumi | 3.x | IaC — define y despliega recursos AWS |
| pulumi-aws | 7.x | Provider de AWS para Pulumi |
| Poetry | latest | Gestor de dependencias |
| AWS Lambda | Python 3.12 runtime | Función principal de sync |
| AWS Secrets Manager | — | Almacén de credenciales en runtime |
| AWS CloudWatch | — | Logs de la Lambda |
| AWS IAM | — | Rol de ejecución de Lambdas |

> **No hay `requests`**: el HTTP client usa solo `urllib` de la stdlib para evitar dependencias en el zip de la Lambda.

---

## Estructura de directorios

```
backend-integrations/
├── __main__.py                          ← Entrypoint de Pulumi
├── config.py                            ← Lee configuración de Pulumi (env, region, account)
├── Pulumi.yaml                          ← Configuración del stack Pulumi
├── pyproject.toml                       ← Dependencias con Poetry
│
├── commons/
│   ├── __init__.py                      ← Exporta DEFAULT_TAGS
│   └── tags.py                          ← Tags AWS comunes {Environment, Project, Owner}
│
└── lambdas/
    ├── __init__.py                      ← LambdasStack: IAM role + instancia de cada lambda stack
    └── sync_blog_to_platforms/
        ├── infra_config.py              ← LambdaSyncBlogToPlatformsStack (Pulumi resource)
        ├── lambda_function.py           ← Handler principal de la Lambda
        ├── test_lambda.py               ← Tests de integración (pytest)
        │
        ├── adapters/
        │   ├── __init__.py              ← Exporta BlogPublisher y adapters
        │   ├── base.py                  ← PublishingAdapter (ABC) + BlogPublisher (facade)
        │   ├── devto.py                 ← Adapter Dev.to (REST API) ✓ implementado
        │   ├── hashnode.py              ← Adapter Hashnode (GraphQL API) ✓ implementado
        │   └── medium.py                ← Adapter Medium ✗ TODO
        │
        └── utils/
            ├── __init__.py
            ├── http_client.py           ← http_get / http_post / http_put (urllib puro)
            ├── portable_text.py         ← Convierte Portable Text de Sanity → Markdown
            └── sanity_client.py         ← fetch_post_from_sanity + verify_sanity_signature
```

---

## Flujo de ejecución

```
Sanity CMS publica post
        │
        ▼
API Gateway POST /publish
        │
        ▼
Lambda: lambda_function.lambda_handler()
  1. Lee secretos de AWS Secrets Manager (cacheado en memoria para warm starts)
  2. Valida firma HMAC-SHA256 del webhook (header: sanity-webhook-signature)
  3. Parsea payload y extrae el slug del documento
  4. Si _type != "post", ignora y devuelve 200
  5. Consulta Sanity GROQ API para obtener el post completo
  6. Por cada plataforma configurada en PUBLISH_PLATFORM:
       - BlogPublisher.publish(post, blog_base_url)
       - Resultado acumulado en lista
  7. Devuelve 200 (todo OK) / 207 (parcial) / 502 (todo falló)
```

---

## Gestión de secretos

Los secretos **no se usan como env vars de la Lambda**. Se leen en runtime desde **AWS Secrets Manager**.

**Nombre del secreto**: `{ENVIRONMENT}-{APP_NAME}-secret-variables`

| Clave | Descripción |
|---|---|
| `PUBLISH_PLATFORM` | Plataformas destino separadas por coma: `devto`, `medium`, `hashnode` |
| `DEVTO_API_KEY` | API Key de Dev.to |
| `MEDIUM_INTEGRATION_TOKEN` | Integration token de Medium |
| `HASHNODE_ACCESS_TOKEN` | Access token de Hashnode |
| `HASHNODE_PUBLICATION_ID` | ID de la publicación en Hashnode |
| `SANITY_TOKEN` | Token de lectura de Sanity |
| `SANITY_WEBHOOK_SECRET` | Secret HMAC para verificar webhooks de Sanity |
| `BLOG_BASE_URL` | URL base del blog (ej: `https://davidcuy.com/blog`) |

**Env vars no sensibles** (configuradas en la Lambda directamente):
- `ENVIRONMENT` → entorno (ej: `prod`)
- `APP_NAME` → nombre del proyecto (ej: `sync-personal-blog`)
- `LOG_LEVEL` → nivel de log (ej: `INFO`)

---

## Adapters de publicación

### Patrón

Todos los adapters implementan `PublishingAdapter` (ABC):
- `render(post, blog_base_url) → dict` — construye el payload para la API destino
- `publish(post, blog_base_url) → dict` — ejecuta render + llamada HTTP; devuelve `{action, platform, platform_id, url, title}`

`BlogPublisher` es el facade que instancia el adapter correcto según la plataforma.

### DevToAdapter (`adapters/devto.py`)
- REST API: `https://dev.to/api`
- Detecta si ya existe un artículo por título exacto → hace PUT (update) o POST (create)
- Tags: máximo 4, solo alfanuméricos (requisito de Dev.to)
- Usa `canonical_url` apuntando a `{BLOG_BASE_URL}/{slug}`

### HashnodeAdapter (`adapters/hashnode.py`)
- GraphQL API: `https://gql.hashnode.com`
- Busca post existente por slug → usa `updatePost` o `publishPost` mutation
- Resuelve categorías a tags de Hashnode mediante `searchTags` query
- `updatePost` no acepta `publicationId` ni `publishedAt`

### MediumAdapter (`adapters/medium.py`)
- **No implementado** — `render()` y `publish()` lanzan `NotImplementedError`

---

## Sanity — Configuración

| Parámetro | Valor |
|---|---|
| Project ID | `my6ptkxm` |
| Dataset | `production` |
| API version | `2024-01-01` |

**GROQ query usada** para obtener el post completo:

```groq
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
```

---

## Infraestructura Pulumi

### Recursos creados

```
LambdasStack
└── IAM Role: {env}-{app}-lambda-execution-role
    Políticas inline:
      - lambda-log-policies (CloudWatch Logs)
      - lambda-parameters-secrets-policy (Secrets Manager + SSM)
    Managed policies:
      - AWSLambdaExecute
      - AWSLambdaVPCAccessExecutionRole

    LambdaSyncBlogToPlatformsStack
    ├── CloudWatch Log Group: /aws/lambda/{env}-{app}-sync_blog_to_platforms (retención: 5 días)
    └── Lambda Function: {env}-{app}-sync_blog_to_platforms
        runtime: Python 3.12 | memory: 128MB | timeout: 5s
        handler: lambda_function.lambda_handler
        code: AssetArchive del directorio lambdas/sync_blog_to_platforms/
```

### Configuración Pulumi (`Pulumi.yaml`)

```yaml
global:env:      prod
global:app-name: sync-personal-blog
aws:region:      us-east-1
```

---

## Desarrollo local y tests

### Requisitos previos
1. Crear `lambdas/sync_blog_to_platforms/.env` con las credenciales reales (ver tabla de secretos arriba)

### Ejecutar tests de integración

```bash
cd lambdas/sync_blog_to_platforms/
pip install python-dotenv pytest
python -m pytest test_lambda.py -v -s

# Solo Hashnode:
python -m pytest test_lambda.py::test_hashnode_adapter -v -s
```

Los tests mockean `_load_secrets` para leer del `.env` local en lugar de AWS Secrets Manager.

### Comandos Pulumi

```bash
# Desde la raíz del proyecto (donde está Pulumi.yaml)
poetry run pulumi preview   # ver cambios antes de aplicar
poetry run pulumi up        # desplegar infraestructura
poetry run pulumi stack     # ver estado del stack
```

---

## Convenciones del proyecto

- **Sin `requests`**: todo HTTP usa `urllib.request` de stdlib para mantener el zip de la Lambda sin dependencias externas
- **Secretos cacheados**: `_secrets_cache` evita llamadas repetidas a Secrets Manager en warm starts
- **Upsert en adapters**: todos los adapters verifican si el post ya existe antes de crear — hacen update si ya existe
- **Portable Text → Markdown**: conversión sin dependencias en `utils/portable_text.py`; soporta párrafos, headings h1-h6, blockquote, listas, imágenes de bloque y bloques de código
- **Tags AWS**: siempre aplicar `DEFAULT_TAGS` (`Environment`, `Project`, `Owner`) a todos los recursos
- **Nombres de recursos**: patrón `{environment}-{app_name}-{resource_name}`

---

## Añadir una nueva plataforma

1. Crear `lambdas/sync_blog_to_platforms/adapters/nueva_plataforma.py` implementando `PublishingAdapter`
2. Registrar en `adapters/__init__.py` (importar y añadir a `__all__`)
3. Registrar en `adapters/base.py` dentro de `_default_registry()`
4. Añadir manejo de credenciales en `lambda_function.py` → `_build_publisher()`
5. Documentar las claves necesarias en el secreto de AWS Secrets Manager
