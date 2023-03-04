import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3BottomLeftIcon,
  ChatBubbleLeftRightIcon,
  SunIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { Fragment, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MyChatGPTContext } from "../contexts/MyChatGPTContext";
import HistoryItem from "./HistoryItem";

export default function Layout(props: { children?: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { state, dispatch } = useContext(MyChatGPTContext);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    dispatch({ type: "init" });
  }, []);

  return (
    <>
      <Head>
        <title>My ChatGPT</title>
      </Head>

      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-indigo-400 pt-5 pb-4 dark:bg-slate-800">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="mt-5 h-0 flex-1 overflow-y-auto">
                    <nav className="space-y-1 px-2">
                      {state.indices
                        .slice()
                        .reverse()
                        .map((item) => (
                          <HistoryItem key={item} item={item} />
                        ))}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-grow flex-col overflow-y-auto bg-indigo-400 pt-5 dark:bg-slate-800">
            <div className="mt-5 flex flex-1 flex-col">
              <nav className="flex-1 space-y-1 px-2 pb-4">
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
                    className="mr-4 h-6 w-6 flex-shrink-0 text-indigo-700"
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
            </div>
          </div>
        </div>
        <div className="h-screen lg:pl-64">
          <div className="sticky top-0 z-10 flex flex-shrink-0 bg-white p-2 shadow dark:bg-slate-800">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex flex-1 items-center justify-center px-4">
              <Image
                className="h-4 w-auto sm:h-6 md:h-8"
                src={theme === "dark" ? "/dog-light.png" : "/dog.png"}
                width={134}
                height={126}
                alt="My ChatGPT Logo"
              />
              <h1
                onClick={() => {
                  router.push("/");
                }}
                className="text-md px-2 font-semibold text-gray-900 dark:text-white sm:text-xl md:text-2xl"
              >
                My ChatGPT
              </h1>
            </div>
            <button
              className="pr-2"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <SunIcon className="h-6 w-6 text-slate-400" aria-hidden="true" />
            </button>
          </div>

          <main>
            <div className="pt-4">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {props.children}
              </div>
            </div>
          </main>

          <footer className="mt-4 flex items-center justify-center rounded-lg dark:bg-slate-700">
            <span className="text-sm text-gray-500 dark:text-gray-400 sm:text-center">
              © 2023{" "}
              <a
                href="https://github.com/lucifer1004"
                className="hover:underline"
              >
                Gabriel Wu
              </a>
              . All Rights Reserved.
            </span>
          </footer>
        </div>
      </div>
    </>
  );
}
