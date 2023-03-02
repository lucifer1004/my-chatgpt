import React from "react";
import ReactMarkdown from "react-markdown";
import RemarkMathPlugin from "remark-math";
import rehypeKatex from "rehype-katex";
import SyntaxHighlighter from "react-syntax-highlighter";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { solarizedDark as dark } from "react-syntax-highlighter/dist/cjs/styles/prism";
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
                  wrapLongLines={true}
                  showLineNumbers={true}
                  PreTag="div"
                  {...props}
                />
                <CopyToClipboard text={String(children)}>
                  <button
                    className="absolute flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300"
                    style={{
                      height: "16px",
                      width: "20px",
                      top: "4px",
                      right: "4px",
                      fontSize: "14px",
                      textAlign: "center",
                    }}
                  >
                    📋
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
  return <ReactMarkdown {...newProps} />;
}

export default Markdown;
