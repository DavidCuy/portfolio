import pulumi
from pathlib import Path
import pulumi_aws as aws

vpc_cfg = pulumi.Config("vpc")
parameters_cfg = pulumi.Config("parameters")
domain_cfg = pulumi.Config("domain")

# Load configuration values from Pulumi config
try:
    ENVIRONMENT = pulumi.Config("global").require("env")
    AWS_REGION = pulumi.Config("aws").require("region")
    AWS_ACCOUNT_ID = aws.get_caller_identity().account_id
except Exception as e:
    ENVIRONMENT = "dev"
    AWS_REGION = "us-east-1"
    AWS_ACCOUNT_ID = "default-account-id"

APP_NAME = pulumi.Config("global").require("app-name")

def add_param_prefix(param_name: str) -> str:
    return f"/{ENVIRONMENT.lower()}/{APP_NAME.lower()}/{param_name}"

def add_secret_prefix(secret_name: str) -> str:
    return f"{ENVIRONMENT.lower()}-{APP_NAME.lower()}-{secret_name}"


ROOT_PROJECT = Path(__file__).parent.parent


