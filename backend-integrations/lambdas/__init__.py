import json
import pulumi
import pulumi_aws as aws
from pulumi import ResourceOptions

import config as project_config

from .sync_blog_to_platforms.infra_config import LambdaSyncBlogToPlatformsStack

class LambdasStack(pulumi.ComponentResource):
    def __init__(self,
                 name: str,
                 tags: dict,
                 opts: ResourceOptions = None
        ):
        super().__init__("davidcuy:portfolio:lambdasStack", name, {}, opts)

        self.name = name
        self.tags = tags or {}
        
        self.lambda_execution_role = aws.iam.Role(
            f"{name}-lambda-execution-role",
            name=f"{project_config.ENVIRONMENT}-{project_config.APP_NAME}-lambda-execution-role",
            assume_role_policy=aws.iam.get_policy_document(
                statements=[{
                    "effect": "Allow",
                    "actions": ["sts:AssumeRole"],
                    "principals": [{
                        "type": "Service",
                        "identifiers": ["lambda.amazonaws.com"]
                    }]
                }]
            ).json,
            inline_policies=[
                {
                    "name": "lambda-log-policies",
                    "policy": json.dumps({ 
                        "Version": "2012-10-17",
                        "Statement": [{
                            "Action": [
                                "logs:CreateLogGroup",
                                "logs:CreateLogStream",
                                "logs:PutLogEvents"
                            ],
                            "Effect": "Allow",
                            "Resource": ["arn:aws:logs:*:*:*"],
                        }],
                    }),
                }, {
                    "name": "lambda-parameters-secrets-policy",
                    "policy": json.dumps({ 
                        "Version": "2012-10-17",
                        "Statement": [{
                            "Action": [
                                "secretsmanager:GetResourcePolicy",
                                "secretsmanager:GetSecretValue",
                                "secretsmanager:DescribeSecret",
                                "secretsmanager:ListSecretVersionIds",
                                "ssm:GetParameters",
                                "ssm:GetParameter"
                            ],
                            "Effect": "Allow",
                            "Resource": ["*"],
                        }],
                    }),
                }
            ],
            managed_policy_arns=[
                "arn:aws:iam::aws:policy/AWSLambdaExecute",
                "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
            ],
            path="/",
            tags=tags,
            opts=pulumi.ResourceOptions(parent=self)
        )

        self.sync_blog_to_platforms_lambda_stack = LambdaSyncBlogToPlatformsStack(
            name=f"{name}-sync-blog-to-platforms",
            environment=project_config.ENVIRONMENT,
            app_name=project_config.APP_NAME,
            lambda_execution_role_arn=self.lambda_execution_role.arn,
            tags=tags,
            opts=pulumi.ResourceOptions(parent=self)
        )
        
        self.register_outputs({
            "lambda_role_name": self.lambda_execution_role.name,
            "lambda_role_arn": self.lambda_execution_role.arn
        })

