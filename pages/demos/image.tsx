/* eslint-disable @next/next/no-img-element */
import { PhotoIcon } from "@heroicons/react/24/outline";
import { PhotoIcon as PhotoIconSolid } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import Button from "../../components/Button";
import Layout from "../../components/Layout";
import Markdown from "../../components/Markdown";

export default function Home() {
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [subject, setSubject] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  async function handleSubmit() {
    setSubmitDisabled(true);

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: subject,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setImageUrl(data.images[0].url);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }

    setSubmitDisabled(false);
  }

  async function handleKeyDown(e: KeyboardEvent) {
    if (e.key == "Enter" || e.keyCode == 13) {
      e.preventDefault();
      await handleSubmit();
    }
  }

  return (
    <Layout>
      <div className=" flex h-[calc(100vh-150px)] flex-col items-center justify-between gap-3">
        <Markdown
          disableCopy
          className="h-20 shrink-0 grow-0"
          children={`### 生成随机图片

在下面的输入框中输入您想要查找的图片主题，然后点击“生成”按钮，即可获取一张该主题的随机图片。
`}
        />
        <div className="flex grow items-center justify-center overflow-auto">
          {imageUrl === "" ? null : (
            <img
              src={imageUrl}
              alt={`An image of ${subject}`}
            />
          )}
        </div>
        <div className="flex h-16 shrink-0 grow-0 items-center justify-center gap-2">
          <input
            value={subject}
            className="lg:text-md w-30 h-10 rounded-md border-2 text-center text-black text-sm"
            onChange={(e) => setSubject(e.target.value)}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onKeyDown={(e) => handleKeyDown(e as any as KeyboardEvent)}
          />
          <Button
            onClick={async () => {
              await handleSubmit();
              setSubject("");
            }}
            disabled={submitDisabled}
            className="flex h-10 w-20 items-center justify-center gap-2 bg-indigo-600 text-indigo-300 disabled:cursor-not-allowed disabled:bg-indigo-300 disabled:text-indigo-600 hover:bg-indigo-300 hover:text-indigo-600 dark:bg-slate-100 dark:text-slate-400 dark:disabled:bg-slate-400 dark:disabled:text-slate-100 dark:hover:bg-slate-400 dark:hover:text-slate-100"
            title="生成随机图片"
          >
            {submitDisabled ? (
              <PhotoIconSolid className="h-6" aria-hidden="true" />
            ) : (
              <PhotoIcon className="h-6" aria-hidden="true" />
            )}
            生成
          </Button>
        </div>
      </div>
    </Layout>
  );
}
