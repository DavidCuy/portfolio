import logging
import config as project_config
from commons import DEFAULT_TAGS


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


logger.info(f"Environment: {project_config.ENVIRONMENT}")
logger.info(f"Project Name: {project_config.APP_NAME}")
logger.info(f"Default Tags: {DEFAULT_TAGS}")

import lambdas
logger.info("Starting creation...")

lambdas_stack = lambdas.LambdasStack(
    name=f"{project_config.ENVIRONMENT}-{project_config.APP_NAME}-lambdasStack",
    tags=DEFAULT_TAGS,
)

