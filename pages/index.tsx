import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "../components/Button";
import Layout from "../components/Layout";
import Markdown from "../components/Markdown";
import { MyChatGPTContext } from "../contexts/MyChatGPTContext";

export default function Home() {
  const router = useRouter();
  const { dispatch } = useContext(MyChatGPTContext);

  return (
    <Layout>
      <div className="flex h-[calc(100vh-150px)] flex-col items-center justify-center">
        <div className="overflow-auto">
          <Markdown
            disableCopy
            children={`### My ChatGPT - 构建您自己的聊天机器人站点

My ChatGPT是一款基于OpenAI的ChatGPT API开发的个人聊天机器人站点。它能够为您提供一个私人的的聊天机器人站点，使您的客户和访客能够与您的机器人进行互动。只需提供API Key，您就能轻松地搭建站点。

My ChatGPT的作者[Gabriel Wu](https://github.com/lucifer1004)已将源代码以MIT协议开源在[GitHub](https://github.com/lucifer1004/my-chatgpt)上，这意味着您可以自由地修改和分发代码，以满足您的需求。

如果您正在寻找一个简单易用的个人聊天机器人站点，那么My ChatGPT绝对是您的不二之选。立即获取API Key，开始构建您的聊天机器人站点吧！

现在，你可以：

- [生成随机图片](/demos/image)

或者：
`}
          />
          <div className="flex items-center justify-center">
            <Button
              onClick={() => {
                const newId = uuidv4();
                dispatch({ type: "create", chatId: newId });
                router.push(`/chats/${newId}`);
              }}
              className="mt-5 flex w-[50%] items-center justify-center gap-2 bg-indigo-400 text-indigo-100 hover:bg-indigo-300 hover:text-indigo-600 dark:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-400 dark:hover:text-slate-100"
              title="开始一个新对话"
            >
              <ChatBubbleLeftRightIcon className="h-6" aria-hidden="true" />
              立刻开始对话
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
