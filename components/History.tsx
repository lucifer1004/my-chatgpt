import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import {
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  ChatBubbleLeftRightIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { Fragment, useContext, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MyChatGPTContext } from "../contexts/MyChatGPTContext";
import { wrappedWriteClipboard } from "../utils/client";
import HistoryItem from "./HistoryItem";

export default function History() {
  const { state, dispatch } = useContext(MyChatGPTContext);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [importPromptOpen, setImportPromptOpen] = useState(false);
  const [importedHistory, setImportedHistory] = useState("");
  const router = useRouter();
  const cancelButtonRef = useRef(null);
  const submitButtonRef = useRef(null);

  async function exportHistory() {
    try {
      const indices = JSON.parse(
        localStorage.getItem("my-chatgpt-indices") || "[]"
      );
      const history = [];
      for (const index of indices) {
        const messages = localStorage.getItem(index) || "[]";
        history.push({ index, messages });
      }
      await wrappedWriteClipboard(JSON.stringify(history));
      alert(`导出成功：共${indices.length}条记录`);
    } catch (e) {
      alert(`导出失败：${e}`);
    }
  }

  async function importHistory(historyStr: string) {
    try {
      const history = JSON.parse(historyStr);
      const indices = JSON.parse(
        localStorage.getItem("my-chatgpt-indices") || "[]"
      );

      let added = 0;
      for (const { index, messages } of history) {
        if (indices.findIndex((id) => id === index) === -1) {
          indices.push(index);
          added++;
          localStorage.setItem(index, messages);
        }
      }
      localStorage.setItem("my-chatgpt-indices", JSON.stringify(indices));
      dispatch({ type: "import", indices });
      alert(
        `导入成功：共${history.length}条记录，导入${added}条${
          history.length === added
            ? ""
            : `，${history.length - added}条重复记录未导入`
        }`
      );
    } catch (e) {
      if (historyStr !== null) {
        alert(`导入失败：${e}`);
      }
    }
  }

  function clearHistory() {
    const indices = JSON.parse(
      localStorage.getItem("my-chatgpt-indices") || "[]"
    );
    for (const index of indices) {
      localStorage.removeItem(index);
    }
    localStorage.setItem("my-chatgpt-indices", "[]");
  }

  return (
    <div className="mt-5 flex h-screen flex-1 flex-col overflow-hidden">
      <nav className="grow space-y-1 overflow-y-auto px-2 pb-4 scrollbar-thin scrollbar-thumb-inherit">
        <button
          type="button"
          onClick={() => {
            const newId = uuidv4();
            dispatch({ type: "create", chatId: newId });
            router.push(`/chats/${newId}`);
          }}
          className="group flex w-full items-center justify-center rounded-md px-2 py-2 text-base font-medium text-indigo-800 hover:bg-indigo-200 dark:text-slate-200"
        >
          <ChatBubbleLeftRightIcon
            className="mr-4 h-6 w-6 flex-shrink-0 text-indigo-700 dark:text-indigo-400"
            aria-hidden="true"
          />
          创建新对话
        </button>
        {state.indices
          .slice()
          .reverse()
          .map((item) => (
            <HistoryItem key={item} item={item} />
          ))}
      </nav>
      <hr />
      <div className="basis-30 flex w-full shrink-0 grow-0 items-center justify-center">
        <button
          className="flex grow items-center justify-center rounded-md p-2 text-indigo-300 hover:bg-indigo-600"
          title="导出全部聊天记录到剪贴板"
          onClick={exportHistory}
        >
          <ArrowUpOnSquareIcon
            className="h-6 w-6 flex-shrink-0 text-indigo-700 dark:text-indigo-400"
            aria-hidden="true"
          />
        </button>
        <button
          className="flex grow items-center justify-center rounded-md p-2 text-indigo-300 hover:bg-indigo-600"
          title="导入从其他地方导出的聊天记录"
          onClick={() => setImportPromptOpen(true)}
        >
          <ArrowDownOnSquareIcon
            className="h-6 w-6 flex-shrink-0 text-indigo-700 dark:text-indigo-400"
            aria-hidden="true"
          />
        </button>
        <button
          className="flex grow items-center justify-center rounded-md p-2 text-indigo-300 hover:bg-indigo-600"
          title="清空全部聊天记录"
          onClick={() => {
            setDeleteConfirmOpen(true);
          }}
        >
          <TrashIcon
            className="h-6 w-6 flex-shrink-0 text-indigo-700 dark:text-indigo-400"
            aria-hidden="true"
          />
        </button>
      </div>
      <Transition.Root show={deleteConfirmOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40"
          initialFocus={cancelButtonRef}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-slate-900"
                        >
                          清空聊天记录
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-slate-500">
                            你确定要删除全部聊天记录吗？
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={() => {
                        clearHistory();
                        dispatch({ type: "clear" });
                        setDeleteConfirmOpen(false);
                      }}
                    >
                      确认删除
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto"
                      onClick={() => setDeleteConfirmOpen(false)}
                      ref={cancelButtonRef}
                    >
                      取消
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={importPromptOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40"
          initialFocus={submitButtonRef}
          onClose={() => setImportPromptOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-indigo-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 grow text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-slate-900"
                        >
                          导入聊天记录
                        </Dialog.Title>
                        <div className="mt-2">
                          <textarea
                            rows={3}
                            className="focus:shadow-outline w-full appearance-none rounded border bg-white py-2 px-3 text-sm leading-tight text-black shadow focus:outline-none"
                            value={importedHistory}
                            onChange={(e) => setImportedHistory(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                      onClick={async () => {
                        await importHistory(importedHistory);
                        setImportPromptOpen(false);
                        setImportedHistory("");
                      }}
                      ref={submitButtonRef}
                    >
                      导入
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto"
                      onClick={() => {
                        setImportPromptOpen(false);
                        setImportedHistory("");
                      }}
                    >
                      取消
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
