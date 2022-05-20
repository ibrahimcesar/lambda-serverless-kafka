import { Handler } from "aws-lambda";

export const handler: Handler = async event => {
  return {
    body: `Hello lambda!

${JSON.stringify(event, null, 2)}"

    `,
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
      "X-Clacks-Overhead": "GNU Terry Pratchett",
    },
    statusCode: 200,
  };
};
