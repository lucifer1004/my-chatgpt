import { OpenAIStream } from "../../utils/edge";

if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "OpenAI API key not configured, please follow instructions in README.md"
  );
}

export const config = {
  runtime: "edge",
};

export default async function (req: Request) {
  const { messages, temperature } = await req.json();

  const completionStream = await OpenAIStream({
    model: process.env.OPENAI_MODEL_NAME ?? "gpt-4o",
    messages,
    temperature,
    stream: true,
  });

  return new Response(completionStream);
}
