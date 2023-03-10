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
    model: "gpt-3.5-turbo",
    messages,
    temperature,
    stream: true,
  });

  return new Response(completionStream);
}
