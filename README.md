# 🌴 CDK v2 Simple Lambda HTTP ApiGateway Starter

## Alpha L2 Constructs

This project uses L2 CDK v2 constructs in `alpha` stage for `apigatewayv2` use of HTTP API and its integration. I decided to go with HTTP API because of the lower costs for this kind of API.

## Beware export lambda

In the file `src/lambda/index.ts`, the exported name for the lambda handler is **not dynamic**, so it can be configurable, you'll need to add your own, each time. This is because, `import` and `export` statements are specifically designed this way because they have to be statically analyzable, i.e. the import and export names have to be known before the code is executed.
