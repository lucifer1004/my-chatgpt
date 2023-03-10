import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { generatePrompt } from "../../utils/server";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const input = req.body.input || "";
  if (input.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "你没有输入任何内容",
      },
    });
    return;
  }

  try {
    // In case the input is too long, we will only use the last 4096 tokens.
    const messages: ChatCompletionRequestMessage[] = [
      ...req.body.history,
      generatePrompt(input),
    ];

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
      temperature: parseFloat(req.body.temperature) || 0.6,
    });

    // Comment them out if you do not need logging
    console.info(input);
    console.info(completion.data.choices[0]);
    res
      .status(200)
      .json({ result: completion.data.choices[0].message?.content });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}
