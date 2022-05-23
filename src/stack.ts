import { Construct } from "constructs";
import { CfnOutput, Duration, Stack, StackProps } from "aws-cdk-lib";

import * as lambda from "aws-cdk-lib/aws-lambda";

// The APIs of higher level constructs in this module are experimental and under active development for v2. In package.json they are pinned down.
// Check https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigatewayv2-readme.html for more info
import * as apigateway from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

import * as dotenv from "dotenv";

import path from "node:path";

dotenv.config();

const upstashConfig = {
  UPSTASH_BROKER: `${process.env.UPSTASH_BROKER}`,
  UPSTASH_USERNAME: `${process.env.UPSTASH_USERNAME}`,
  UPSTASH_PASSWORD: `${process.env.UPSTASH_PASSWORD}`,
};

class KafkaLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const fnConsumer = new lambda.Function(
      this,
      `Consumer${process.env.LAMBDA_NAME}`,
      {
        architecture: lambda.Architecture.ARM_64,
        code: lambda.Code.fromAsset(path.join(__dirname, "..", "dist")),
        handler: "index.consumer",
        runtime: lambda.Runtime.NODEJS_16_X,
        timeout: Duration.seconds(30),
        environment: upstashConfig,
      }
    );

    const fnProducer = new lambda.Function(
      this,
      `Producer${process.env.LAMBDA_NAME}`,
      {
        architecture: lambda.Architecture.ARM_64,
        code: lambda.Code.fromAsset(path.join(__dirname, "..", "dist")),
        handler: "index.producer",
        runtime: lambda.Runtime.NODEJS_16_X,
        timeout: Duration.seconds(30),
        environment: upstashConfig,
      }
    );

    const endpoint = new apigateway.HttpApi(
      this,
      `Endpoint${process.env.API_NAME}`,
      {
        apiName: `Endpoint${process.env.API_NAME}`,
        description: `${process.env.API_DESCRIPTION}`,
      }
    );

    const fnConsumerIntegration = new HttpLambdaIntegration(
      `Consumer${process.env.API_NAME}`,
      fnConsumer
    );

    const fnProducerIntegration = new HttpLambdaIntegration(
      `Producer${process.env.API_NAME}`,
      fnProducer
    );

    endpoint.addRoutes({
      path: "/consumer",
      methods: [apigateway.HttpMethod.POST],
      integration: fnConsumerIntegration,
    });

    endpoint.addRoutes({
      path: "/producer",
      methods: [apigateway.HttpMethod.POST],
      integration: fnProducerIntegration,
    });

    new CfnOutput(this, "HttpApiUrl", { value: endpoint.apiEndpoint });
  }
}

export { KafkaLambdaStack };
