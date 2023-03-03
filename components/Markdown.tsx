import React from "react";
import ReactMarkdown from "react-markdown";
import RemarkMathPlugin from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { materialDark as dark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import "katex/dist/katex.min.css";

function Markdown(props) {
  const newProps = {
    ...props,
    remarkPlugins: [RemarkMathPlugin],
    rehypePlugins: [rehypeKatex],
    components: {
      ...props.components,
      code({ node, inline, className, children, ...props }) {
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
                  <button className="absolute top-1 right-1 flex h-4 items-center justify-center rounded bg-gray-400 text-sm text-black hover:bg-gray-700">
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
  return <ReactMarkdown className="prose xl:prose-xl" {...newProps} />;
}

export default Markdown;
