import {
  ChatBubbleLeftRightIcon,
  ClipboardDocumentIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "../../components/Button";
import Layout from "../../components/Layout";
import Markdown from "../../components/Markdown";
import { MyChatGPTContext } from "../../contexts/MyChatGPTContext";

export default function ChatPage() {
  const router = useRouter();
  const { uid } = router.query;
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const { dispatch } = useContext(MyChatGPTContext);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem(uid as string) || "[]"));
  }, [uid]);

  async function handleSubmit() {
    setSubmitDisabled(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input,
          history,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      const newHistory = [
        ...history,
        { role: "user", content: input },
        { role: "assistant", content: data.result },
      ];
      setHistory(newHistory);
      localStorage.setItem(uid as string, JSON.stringify(newHistory));
      setInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
    setSubmitDisabled(false);
  }

  async function handleKeyDown(e) {
    if (e.keyCode == 13 && e.shiftKey) {
      e.preventDefault();
      await handleSubmit();
    }
  }

  async function handleExport() {
    const historyText = history
      .map(
        (x, index) =>
          (x.role === "assistant" ? "A" : "Q") +
          (Math.floor(index / 2) + 1) +
          ": " +
          x.content
      )
      .join("\n");
    await navigator.clipboard.writeText(historyText);
    alert("导出成功");
  }

  async function onSubmit(event) {
    event.preventDefault();
    await handleSubmit();
  }

  return (
    <Layout>
      <div className="basis-50 shrink-0 grow-0 flex-col gap-5">
        <div className="flex max-w-5xl items-center justify-center gap-2">
          <ul className="list-none divide-y-2 divide-gray-500 overflow-auto">
            {Array.from({ length: history.length / 2 }).map((_, index) => (
              <li key={index * 2}>
                <Markdown children={"❓\n" + history[index * 2].content} />
                <Markdown children={"🤖\n" + history[index * 2 + 1].content} />
                <br />
              </li>
            ))}
          </ul>
        </div>
        <div className="sticky bottom-0 flex h-40 flex-col items-center justify-center gap-2 md:flex-row">
          <textarea
            name="input"
            placeholder="在这里输入（Shift+回车快速提交）"
            value={input}
            className="h-full w-full rounded-md border-2 border-double border-slate-400 bg-gray-100 dark:bg-slate-600 md:basis-4/5"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
          />
          <div className="margin-2 flex basis-1/5  items-center justify-center gap-2">
            <Button
              onClick={onSubmit}
              className="flex items-center justify-center"
              title="将当前输入的内容发送给ChatGPT"
              disabled={submitDisabled}
            >
              <PaperAirplaneIcon
                className="h-6 text-indigo-300"
                aria-hidden="true"
              />
            </Button>
            <Button
              onClick={handleExport}
              title="将当前对话的完整内容复制到剪贴板"
            >
              <ClipboardDocumentIcon
                className="h-6 text-indigo-300"
                aria-hidden="true"
              />
            </Button>
            <Button
              onClick={() => {
                const newId = uuidv4();
                dispatch({ type: "create", chatId: newId });
                router.push(`/chats/${newId}`);
              }}
              className="lg:hidden"
              title="开始一个新对话（当前对话将被自动保存）"
            >
              <ChatBubbleLeftRightIcon
                className="h-6 text-indigo-300"
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
