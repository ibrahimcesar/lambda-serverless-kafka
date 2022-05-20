import { buildSync } from "esbuild";
import { App } from "aws-cdk-lib";
import { SimpleLambdaStack } from "./src/stack";
import * as dotenv from "dotenv";

import path from "node:path";

dotenv.config();

buildSync({
  bundle: true,
  entryPoints: [path.resolve(__dirname, "src", "lambda", "index.ts")],
  external: ["aws-sdk"],
  format: "cjs",
  outfile: path.join(__dirname, "dist", "index.js"),
  platform: "node",
  sourcemap: true,
  target: "node16",
});

const app = new App();
new SimpleLambdaStack(app, `${process.env.STACK_PROJECT}`, {
  description: `${process.env.STACK_DESCRIPTION}`,
  stackName: `${process.env.STACK_NAME}`,
  env: {
    region: `${process.env.AWS_REGION}`,
  },
  tags: {
    project: `${process.env.STACK_PROJECT}`,
  },
});

app.synth();
