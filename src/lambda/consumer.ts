import { Handler } from "aws-lambda";
import { Kafka } from "@upstash/kafka";
import * as dotenv from "dotenv";

dotenv.config();

const kafka = new Kafka({
  url: process.env.UPSTASH_BROKER as string,
  username: process.env.UPSTASH_USERNAME as string,
  password: process.env.UPSTASH_PASSWORD as string,
});

const reader = kafka.consumer();

export const handler: Handler = async event => {
  try {
    const messages = await reader.consume({
      consumerGroupId: "group_1",
      instanceId: "instance_1",
      topics: ["ulysses"],
      autoOffsetReset: "latest",
    });
    console.log(messages);
  } catch (err) {
    console.error(err);
    if (err instanceof Error) throw err;
    else throw new Error(`${err}`);
  }

  return {
    body: JSON.stringify(event, null, 2),
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
      "X-Clacks-Overhead": "GNU Terry Pratchett",
    },
    statusCode: 200,
  };
};
