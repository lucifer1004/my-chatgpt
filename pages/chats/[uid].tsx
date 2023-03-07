import {
  ChatBubbleLeftRightIcon,
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  ClipboardDocumentIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { PaperAirplaneIcon as PaperAirplaneIconSolid } from "@heroicons/react/24/solid";
import { useInViewport } from "ahooks";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "../../components/Button";
import Layout from "../../components/Layout";
import Markdown from "../../components/Markdown";
import { MyChatGPTContext } from "../../contexts/MyChatGPTContext";
import { wrappedWriteClipboard } from "../../utils";

export default function ChatPage() {
  const router = useRouter();
  const { uid } = router.query;
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const { state, dispatch } = useContext(MyChatGPTContext);
  const chatListTop = useRef(null);
  const chatListBottom = useRef(null);
  const [_chatListTopInViewport, chatListTopRatio] = useInViewport(chatListTop);
  const [_chatListBottomInViewport, chatListBottomRatio] =
    useInViewport(chatListBottom);

  function scrollDown() {
    chatListBottom.current.scrollIntoView({
      behavior: "smooth",
      alignToTop: false,
    });
  }

  function scrollUp() {
    chatListTop.current.scrollIntoView({
      behavior: "smooth",
      alignToTop: true,
    });
  }

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem(uid as string) || "[]"));
  }, [uid]);

  useEffect(() => {
    scrollDown();
  }, [history]);

  async function handleSubmit() {
    if (input.trim().length === 0) {
      alert("输入为空");
      return;
    }

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
          temperature: state.temperature,
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
    await wrappedWriteClipboard(historyText);
    alert("导出成功");
  }

  async function onSubmit(event) {
    event.preventDefault();
    await handleSubmit();
  }

  return (
    <Layout>
      <div className="flex h-[calc(100vh-150px)] flex-col justify-between gap-5">
        <div className="grow overflow-auto">
          <div className="flex flex-col justify-center gap-2">
            <div key="chat-list-top" ref={chatListTop}></div>
            {Array.from({ length: history.length / 2 }).map((_, index) => (
              <div key={uid + "-d-" + index.toString()}>
                <Markdown
                  className="p-2"
                  key={uid + "-" + (index * 2).toString()}
                  children={history[index * 2].content}
                />
                <Markdown
                  className="rounded-md bg-indigo-200 p-2 leading-relaxed dark:bg-slate-600"
                  key={uid + "-" + (index * 2 + 1).toString()}
                  children={history[index * 2 + 1].content}
                />
              </div>
            ))}
            <div key="chat-list-bottom" ref={chatListBottom}></div>
          </div>
        </div>
        <div className="md-0 pd-0 flex flex-col items-center justify-center gap-2 md:flex-row">
          <textarea
            rows={3}
            name="input"
            placeholder="在这里输入（Shift+回车快速提交）"
            value={input}
            className="h-full w-full rounded-md border-2 border-double border-slate-400 bg-indigo-200 dark:bg-slate-600 md:basis-[7/8]"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
          />
          <div className="margin-2 flex basis-1/5 items-center justify-center gap-2 ">
            <Button
              onClick={onSubmit}
              className="flex items-center justify-center text-indigo-300 disabled:cursor-not-allowed hover:text-indigo-600 disabled:hover:text-indigo-300 dark:text-slate-400 dark:hover:text-slate-100 dark:disabled:hover:text-slate-400"
              title="将当前输入的内容发送给ChatGPT"
              disabled={submitDisabled}
            >
              {submitDisabled ? (
                <PaperAirplaneIconSolid className="h-6" aria-hidden="true" />
              ) : (
                <PaperAirplaneIcon className="h-6" aria-hidden="true" />
              )}
            </Button>
            {chatListTopRatio < 1 ? (
              <Button
                className="absolute bottom-[70vh] right-5"
                onClick={scrollUp}
                title="滚动到顶部"
              >
                <ChevronDoubleUpIcon
                  className="h-6 text-indigo-300 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-slate-100"
                  aria-hidden="true"
                />
              </Button>
            ) : null}
            {chatListBottomRatio < 1 ? (
              <Button
                className="absolute bottom-[30vh] right-5"
                onClick={scrollDown}
                title="滚动到底部"
              >
                <ChevronDoubleDownIcon
                  className="h-6 text-indigo-300 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-slate-100"
                  aria-hidden="true"
                />
              </Button>
            ) : null}
            <Button
              onClick={handleExport}
              title="将当前对话的完整内容复制到剪贴板"
            >
              <ClipboardDocumentIcon
                className="h-6 text-indigo-300 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-slate-100"
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
                className="h-6 text-indigo-300 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-slate-100"
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
