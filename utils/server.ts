import { encode } from "gpt-3-encoder";
import { ChatCompletionRequestMessage } from "openai";

export function generatePrompt(question: string): ChatCompletionRequestMessage {
  return {
    role: "user",
    content: question,
  };
}

export function encodeMessages(input, history, maxTokens = 4096) {
  const messages: ChatCompletionRequestMessage[] = [generatePrompt(input)];
  let tokenCount = encode(input).length;
  for (let i = history.length - 1; i >= 0; i--) {
    const token = encode(history[i].content).length;
    if (tokenCount + token > maxTokens) {
      console.warn(
        `Input needs to be truncated. The first ${
          i + 1
        } messages are discarded.`
      );
      break;
    }
    messages.push(history[i]);
    tokenCount += token;
  }
  messages.reverse();
  return messages;
}
