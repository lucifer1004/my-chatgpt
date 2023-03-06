/* eslint-disable @next/next/no-img-element */
import { PhotoIcon } from "@heroicons/react/24/outline";
import React, { useContext, useState } from "react";
import Button from "../../components/Button";
import Layout from "../../components/Layout";
import Markdown from "../../components/Markdown";
import { MyChatGPTContext } from "../../contexts/MyChatGPTContext";
import { unsplash } from "../../fixtures/prompts";

export default function Home() {
  const { state } = useContext(MyChatGPTContext);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [subject, setSubject] = useState("");
  const [md, setMD] = useState("");

  async function handleSubmit() {
    setSubmitDisabled(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: unsplash(subject || "random"),
          history: [],
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

      setMD(data.result);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }

    setSubmitDisabled(false);
  }

  return (
    <Layout>
      <div className=" flex h-[calc(100vh-150px)] flex-col items-center justify-between gap-3">
        <Markdown
          disableCopy
          className="h-20 shrink-0 grow-0"
          children={`### Unsplash 图片查找器

在下面的输入框中输入您想要查找的图片主题，然后点击“生成”按钮，即可从Unsplash API中获取一张该主题的随机图片。
`}
        />
        <div className="flex grow items-center justify-center overflow-auto">
          {md === "" ? null : (
            <img
              src={`https://source.unsplash.com/400x300/?${md}`}
              alt={`An image of ${md}`}
            />
          )}
        </div>
        <div className="flex h-16 shrink-0 grow-0 items-center justify-center gap-2">
          <input
            value={subject}
            className="lg:text-md w-30 h-10 rounded-md border-2 text-center text-sm"
            onChange={(e) => setSubject(e.target.value)}
          />
          <Button
            onClick={async () => {
              await handleSubmit();
              setSubject("");
            }}
            disabled={submitDisabled}
            className="flex h-10 w-20 items-center justify-center gap-2 bg-indigo-600 text-indigo-300 disabled:cursor-not-allowed disabled:bg-indigo-300 disabled:text-indigo-600 hover:bg-indigo-300 hover:text-indigo-600 dark:bg-slate-100 dark:text-slate-400 dark:disabled:bg-slate-400 dark:disabled:text-slate-100 dark:hover:bg-slate-400 dark:hover:text-slate-100"
            title="使用Unsplash API获取随机图片"
          >
            <PhotoIcon className="h-6" aria-hidden="true" />
            生成
          </Button>
        </div>
      </div>
    </Layout>
  );
}
