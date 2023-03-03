import React from "react";
import { classNames } from "../utils";

interface ButtonProps {
  disabled?: boolean;
  className?: string;
  title?: string;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (event: any) => void;
  children?: React.ReactNode;
}

export default function Button({
  disabled = false,
  className,
  title,
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      title={title}
      onClick={onClick}
      className={classNames(
        className,
        "rounded-md bg-indigo-600 py-1.5 px-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-600 dark:bg-slate-200 dark:hover:bg-slate-400 dark:disabled:bg-gray-600"
      )}
    >
      {children}
    </button>
  );
}
