import "katex/dist/katex.min.css";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark as dark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import RemarkMathPlugin from "remark-math";
import { classNames } from "../utils";

function Markdown(props) {
  const newProps = {
    ...props,
    remarkPlugins: [RemarkMathPlugin, remarkGfm],
    rehypePlugins: [rehypeKatex],
    components: {
      ...props.components,
      code({ _node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        return (
          <>
            {!inline && match ? (
              <div className="relative">
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, "")}
                  style={dark}
                  language={match[1]}
                  showLineNumbers={true}
                  PreTag="div"
                  {...props}
                />
                <CopyToClipboard text={String(children)}>
                  <button
                    title="复制到剪贴板"
                    className="absolute top-1 right-1 flex items-center justify-center rounded bg-slate-400 p-1 text-sm text-black hover:bg-slate-700"
                  >
                    {match[1] + "📋"}
                  </button>
                </CopyToClipboard>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )}
          </>
        );
      },
    },
  };
  return (
    <div className="relative m-1">
      <ReactMarkdown
        {...newProps}
        className={classNames(
          "dark:xl:prose-xl-invert prose mr-6 max-w-full dark:prose-invert xl:prose-xl",
          newProps.className
        )}
      />
      {!props.disableCopy ? (
        <CopyToClipboard text={String(props.children)}>
          <button
            title="复制到剪贴板"
            className="absolute top-2 right-1 flex h-4 w-4 items-center justify-center rounded border-0 bg-slate-400 text-sm text-black hover:bg-slate-700"
          >
            📋
          </button>
        </CopyToClipboard>
      ) : null}
    </div>
  );
}

export default Markdown;
