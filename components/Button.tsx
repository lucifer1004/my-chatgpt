"use client";

import React from "react";
import { classNames } from "../utils/client";

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
        "rounded-md py-1.5 px-2.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
        className
      )}
    >
      {children}
    </button>
  );
}
