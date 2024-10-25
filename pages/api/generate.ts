import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
  apiKey: process.env.OPENAI_API_KEY ?? "",
});


if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "OpenAI API key not configured, please follow instructions in README.md"
  );
}

export const config = {
  runtime: "edge",
};

export default async function GET(req: Request) {
  const { messages, temperature } = await req.json();

  // Make a request to OpenAI's API based on
  // a placeholder prompt
  const response = await streamText({
    model: openai(process.env.OPENAI_MODEL_NAME ?? "gpt-4o"),
    messages,
    temperature,
  });
  // Respond with the stream
  return response.toTextStreamResponse({
    headers: {
      'Content-Type': 'text/event-stream',
    },
  });
}
