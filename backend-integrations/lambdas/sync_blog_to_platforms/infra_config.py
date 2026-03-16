import logging
import pulumi
import pulumi_aws as aws
from pathlib import Path

from typing import Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LambdaSyncBlogToPlatformsStack(pulumi.ComponentResource):
    def __init__(self,
                 name: str,
                 environment: str,
                 app_name: str,
                 lambda_execution_role_arn: pulumi.Output[str],
                 tags: Optional[dict] = None,
                 opts: Optional[pulumi.ResourceOptions] = None):
        super().__init__("davidcuy:portfolio:lambdas:SyncBlogToPlatformsStack", name, {}, opts)

        self.name = name
        self.tags = tags or {}

        lambda_function_name = "sync_blog_to_platforms"
        cur_directory = Path(__file__).parent

        # Create a log group for the lambda function
        self.lambda_log_group = aws.cloudwatch.LogGroup(
            f"{name}-{lambda_function_name}lambda-log-group",
            name=f"/aws/lambda/{environment}-{app_name}-{lambda_function_name}",
            retention_in_days=5,
            opts=pulumi.ResourceOptions(parent=self)
        )

        # Create a lambda function
        self.lambda_function = aws.lambda_.Function(
            f"{name}-lambda-function",
            name=f"{environment}-{app_name}-{lambda_function_name}",
            description="Lambda function",
            role=lambda_execution_role_arn,
            handler="lambda_function.lambda_handler",
            runtime=aws.lambda_.Runtime.PYTHON3D12,
            code=pulumi.asset.AssetArchive({
                ".": pulumi.asset.FileArchive(str(cur_directory.resolve()))
            }),
            memory_size=128,
            timeout=5,
            tags=self.tags,
            environment=aws.lambda_.FunctionEnvironmentArgs(
                variables={
                "ENVIRONMENT": environment,
                "APP_NAME": app_name,
                "LOG_LEVEL": "INFO",
                "PUBLISH_PLATFORM": "devto",
                "DEVTO_API_KEY": "sMoZC1VNWRyEm7aYk9uPzkUY",
                "MEDIUM_INTEGRATION_TOKEN": "your_medium_integration_token_here",
                "HASHNODE_ACCESS_TOKEN": "your_hashnode_access_token_here",
                "HASHNODE_PUBLICATION_ID": "your_hashnode_publication_id_here",
                "SANITY_TOKEN": "skw38XPcFJE46w85AF63eKHAkUt96EQ9iefpWff1au3BRNozErGtDxBznrKDlPjM5JJa5c1cVkbr8eGK72XrFDlCYR9WoFzQtAamKVpEHfBLVdhNp8ESSqMuScWmav6Gd4SUraiU9Sveu5rs502SSmxYAoH5xRPjId80CoQ8OMhUSJYzpiIp",
                "SANITY_WEBHOOK_SECRET": "7AMgeutlmW+vunEoVkcYSZXFsxiRmdltqpmWUQCgWeM=",
                "BLOG_BASE_URL": "https://davidcuy.github.io/es/blog"

            }),
            logging_config={
                "log_format": "Text",
            },
            opts=pulumi.ResourceOptions(parent=self)
        )
        
        self.register_outputs({
            "lambda_function_name": self.lambda_function.name
        })

        