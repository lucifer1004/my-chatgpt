import { encodeMessages } from "../../utils/server";

export default async function (req, res) {
  const input = req.body.input || "";
  const history = req.body.history || [];
  const maxTokens = req.body["max-tokens"] || 4096;
  const messages = encodeMessages(input, history, maxTokens);

  console.info(messages);

  res.status(200).json({ messages });
}
