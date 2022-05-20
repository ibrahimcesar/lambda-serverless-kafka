import { Construct } from "constructs";
import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";

import * as lambda from "aws-cdk-lib/aws-lambda";

// The APIs of higher level constructs in this module are experimental and under active development for v2. In package.json they are pinned down.
// Check https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigatewayv2-readme.html for more info
import * as apigateway from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

import * as dotenv from "dotenv";

import path from "node:path";

dotenv.config();

class SimpleLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const fn = new lambda.Function(this, `${process.env.LAMBDA_NAME}`, {
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(__dirname, "..", "dist")),
      handler: "index.simple",
      runtime: lambda.Runtime.NODEJS_16_X,
    });

    const endpoint = new apigateway.HttpApi(
      this,
      `ApiGwt${process.env.API_NAME}`,
      {
        apiName: `Endpoint${process.env.API_NAME}`,
        description: `${process.env.API_DESCRIPTION}`,
      }
    );

    const fnIntegration = new HttpLambdaIntegration(
      `Integration${process.env.API_NAME}`,
      fn
    );

    endpoint.addRoutes({
      path: "/",
      methods: [apigateway.HttpMethod.GET],
      integration: fnIntegration,
    });

    new CfnOutput(this, "HttpApiUrl", { value: endpoint.apiEndpoint });
  }
}

export { SimpleLambdaStack };
