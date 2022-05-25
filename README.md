# 🐚 Kafka on the Serverless Shore

> Experimenting the Kafka Serverless of Upstash.

Read full article here.

## Deploying

You will need:

- An AWS account
- CDK v2 installed (`npm install -g aws-cdk`)
- CDK boostraped in the Account / Region we'll deploy
- A user for the CDK deploy with the right permissions

> If you need help with all the above, open an Issue to see if there's enough people interested in a tutorial for that.

```
npm install
cp .env.example .env
```

Fill `.env` with your credentials and names.

```
cdk deploy
```

Remember if you have multiple AWS profiles in your machine to pass the flag:

```
cdk deploy --profile namedProfile
```

Bootstraped with my [CDK v2 Simple Lambda HTTP ApiGateway Starter](https://github.com/ibrahimcesar/cdk-simple-lambda-starter)
