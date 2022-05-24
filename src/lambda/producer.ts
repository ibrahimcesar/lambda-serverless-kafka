import { Handler } from "aws-lambda";
import { Kafka } from "@upstash/kafka";
import * as dotenv from "dotenv";

dotenv.config();

const kafka = new Kafka({
  url: process.env.UPSTASH_BROKER as string,
  username: process.env.UPSTASH_USERNAME as string,
  password: process.env.UPSTASH_PASSWORD as string,
});

const writer = kafka.producer();

export const handler: Handler = async event => {
  let response: any = "";

  const payload = JSON.parse(event.body);

  const writing = {
    line: payload.line ?? "",
  };

  try {
    const res = await writer.produce("ulysses", writing, {
      key: payload.author ?? "",
    });
    response = res;
  } catch (err) {
    if (err instanceof Error) throw err;
    else throw new Error(`${err}`);
  }

  return {
    body: JSON.stringify(response, null, 2),
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
      "X-Clacks-Overhead": "GNU Terry Pratchett",
    },
    statusCode: 200,
  };
};
