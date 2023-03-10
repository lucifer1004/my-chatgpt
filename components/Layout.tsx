import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3BottomLeftIcon,
  Cog8ToothIcon,
  SunIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { Fragment, useContext, useEffect, useState } from "react";
import {
  MAXIMUM_TEMPERATURE,
  MINIMUM_TEMPERATURE,
  VERSION_MAJOR,
  VERSION_MINOR,
  VERSION_PATCH,
} from "../constants";
import { MyChatGPTContext } from "../contexts/MyChatGPTContext";
import History from "./History";

export default function Layout(props: { children?: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { state, dispatch } = useContext(MyChatGPTContext);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
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
            className="relative z-30 lg:hidden"
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
              <div className="fixed inset-0 bg-slate-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-30 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-[260px] flex-1 flex-col bg-indigo-400 pt-5 pb-4 dark:bg-slate-800">
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
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300 dark:focus:ring-slate-400"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 text-indigo-300 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-slate-100"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <History />
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
            <History />
          </div>
        </div>
        <div className="flex h-screen flex-col lg:pl-64 ">
          <div className="sticky top-0 z-10 flex h-12 bg-white p-2 shadow dark:bg-slate-800">
            <button
              type="button"
              className="border-r border-slate-200 px-4 text-slate-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3BottomLeftIcon
                className="h-6 text-indigo-300 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-slate-100"
                aria-hidden="true"
              />
            </button>
            <div className="flex flex-1 items-center justify-center px-4">
              {mounted ? (
                <Image
                  className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 "
                  src={theme === "dark" ? "/dog-light.png" : "/dog.png"}
                  width={134}
                  height={126}
                  alt="My ChatGPT Logo"
                />
              ) : (
                <div className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8" />
              )}
              <h1
                onClick={() => {
                  router.push("/");
                }}
                className="text-md px-2 font-semibold text-slate-900 dark:text-white sm:text-xl md:text-2xl"
              >
                My ChatGPT
              </h1>
            </div>

            <button
              className="flex items-center justify-center rounded-full pr-2"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <SunIcon
                className="h-6 text-indigo-300 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-slate-100"
                aria-hidden="true"
              />
            </button>

            <Menu as="div" className="relative ml-3 flex">
              <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm dark:bg-slate-800">
                <span className="sr-only">设置</span>
                <Cog8ToothIcon
                  className="h-6 text-indigo-300 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-slate-100"
                  aria-hidden="true"
                />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-700">
                  <Menu.Item key="temperature" as="div" className="p-2">
                    <label
                      htmlFor="temperature-range"
                      className="mb-2 block text-sm font-medium text-slate-900 dark:text-white"
                    >
                      <span title="模型温度会影响结果的随机性，取值范围为0.0到2.0（但超过1.2时回答基本不可用）。数值越小，模型越确定；数值越大，模型越随机。">
                        模型温度：{state.temperature.toFixed(2)}
                      </span>
                    </label>
                    <input
                      id="temperature-range"
                      type="range"
                      value={state.temperature}
                      min={MINIMUM_TEMPERATURE}
                      max={MAXIMUM_TEMPERATURE}
                      step={0.01}
                      onChange={(e) => {
                        const targetTemperature = Math.max(
                          MINIMUM_TEMPERATURE,
                          Math.min(
                            MAXIMUM_TEMPERATURE,
                            parseFloat(e.target.value)
                          )
                        );
                        dispatch({
                          type: "set-temperature",
                          temperature: targetTemperature,
                        });
                      }}
                      className="h-2 w-full cursor-pointer rounded-lg bg-slate-200 dark:bg-slate-600"
                    />
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          <main className="grow">
            <div className="pt-4">
              <div className="mx-auto max-w-7xl px-4 overflow-y-hidden sm:px-6 lg:px-8">
                {props.children}
              </div>
            </div>
          </main>

          <footer className="m-0 flex h-12 shrink-0 grow-0 items-center justify-center rounded-lg p-0 dark:bg-slate-700">
            <span className="text-sm text-slate-500 dark:text-slate-400 sm:text-center">
              <a
                href="https://github.com/lucifer1004/my-chatgpt"
                className="hover:underline"
              >
                My ChatGPT v{VERSION_MAJOR}.{VERSION_MINOR}.{VERSION_PATCH}
              </a>{" "}
              © 2023{" "}
              <a
                href="https://github.com/lucifer1004"
                className="hover:underline"
              >
                Gabriel Wu
              </a>
            </span>
          </footer>
        </div>
      </div>
    </>
  );
}
