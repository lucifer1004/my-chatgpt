"use client";

import { ChatBubbleLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  CheckCircleIcon,
  TrashIcon as TrashSolidIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { MyChatGPTContext } from "../contexts/MyChatGPTContext";
import { classNames, getSummary } from "../utils/client";

export default function HistoryItem({ item }) {
  const router = useRouter();
  const { dispatch } = useContext(MyChatGPTContext);
  const [deleteState, setDeleteState] = useState(0);

  return (
    <div className="flex items-center justify-center gap-1">
      <Link
        href={`/chats/${item}`}
        className={classNames(
          router.query.uid === item
            ? "bg-indigo-800 text-white"
            : "text-indigo-100 hover:bg-indigo-600",
          "group flex grow items-center truncate rounded-md px-2 py-2 text-sm font-medium"
        )}
      >
        <ChatBubbleLeftIcon
          className="mr-1 h-4 w-4 flex-shrink-0 text-indigo-300"
          aria-hidden="true"
        />
        {getSummary(item)}
      </Link>
      {router.query.uid === item ? (
        <CheckCircleIcon
          className="h-6 w-6 flex-shrink-0 rounded-md p-1 text-indigo-300"
          aria-hidden="true"
        />
      ) : (
        <button
          className="h-6 w-6 flex-shrink-0 rounded-md p-1 text-indigo-300 hover:text-indigo-600"
          onClick={() => {
            if (deleteState === 0) {
              setDeleteState(1);
              setTimeout(() => {
                setDeleteState(0);
              }, 2000);
            } else if (deleteState === 1) {
              dispatch({ type: "delete", chatId: item });
            }
          }}
        >
          {deleteState === 0 ? (
            <TrashIcon aria-hidden="true" />
          ) : (
            <TrashSolidIcon aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}
