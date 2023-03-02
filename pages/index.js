import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [id, setId] = useState(uuidv4());
  const [history, setHistory] = useState([]);
  const [indices, setIndices] = useState([]);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  useEffect(() => {
    const index = localStorage.getItem("my-chatgpt-indices");
    if (index) {
      setIndices(JSON.parse(index));
    }
  }, []);

  function onSave() {
    if (history.length === 0) {
      console.info("No history to save");
      return;
    }

    setIndices((prev) => {
      let newIndices;
      if (prev.findIndex((x) => x === id) === -1) {
        newIndices = [...prev, id];
      } else {
        newIndices = prev;
      }
      localStorage.setItem("my-chatgpt-indices", JSON.stringify(newIndices));
      localStorage.setItem(id, JSON.stringify(history));
      return newIndices;
    });
  }

  function onClick() {
    onSave();
    setId(uuidv4());
    setHistory([]);
  }

  function onLoad(item) {
    onSave();
    setHistory(JSON.parse(localStorage.getItem(item)));
    setId(item);
  }

  function onExport() {
    const historyText = history
      .map((x) => (x.role === "assistant" ? "A: " : "Q: ") + x.content)
      .join("\n");
    alert("导出成功");
    navigator.clipboard.writeText(historyText);
  }

  async function onSubmit(event) {
    setSubmitDisabled(true);
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          animal: animalInput,
          history,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      const newHistory = [
        ...history,
        { role: "user", content: animalInput },
        { role: "assistant", content: data.result },
      ];
      setHistory(newHistory);
      setIndices((prev) => {
        let newIndices;
        if (prev.findIndex((x) => x === id) === -1) {
          newIndices = [...prev, id];
        } else {
          newIndices = prev;
        }
        localStorage.setItem("my-chatgpt-indices", JSON.stringify(newIndices));
        localStorage.setItem(id, JSON.stringify(newHistory));
        return newIndices;
      });
      setAnimalInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }

    setSubmitDisabled(false);
  }

  return (
    <div>
      <Head>
        <title>My ChatGPT</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>My ChatGPT</h3>
        <div className="flex gap-5 flex-col sm:flex-row">
          <div className="flex-1">
            <ul
              className="divide-y-2 divide-gray-500 overflow-auto min-w-20"
            >
              {indices.map((item, index) => (
                <>
                  <li
                    key={index}
                    onClick={() => onLoad(item)}
                    style={{
                      backgroundColor: item === id ? "#dddddd" : "white",
                    }}
                  >
                    {JSON.parse(localStorage.getItem(item))[0].content.substr(
                      0,
                      20
                    ) + "..."}
                  </li>
                  {index < indices.length - 1 ? <hr /> : null}
                </>
              ))}
            </ul>
          </div>

          <div
            className="flex-col gap-5"
          >
            <div
              className="flex gap-2 align-center justify-center"
            >
              <textarea
                type="text"
                name="animal"
                placeholder="在这里输入..."
                value={animalInput}
                className="grow"
                style={{ height: "80px" }}
                onChange={(e) => setAnimalInput(e.target.value)}
              />
              <div
                className="flex-1 flex margin-2 gap-2 align-center justify-center"
              >
                <button
                  onClick={onSubmit}
                  title="将当前输入的内容发送给ChatGPT"
                  disabled={submitDisabled}
                  style={{
                    backgroundColor: submitDisabled ? "grey" : "#10a37f",
                  }}
                >
                  发送
                </button>
                <button
                  onClick={onExport}
                  title="将当前对话的完整内容复制到剪贴板"
                  style={{ backgroundColor: "#2388e2" }}
                >
                  导出
                </button>
                <button
                  onClick={onClick}
                  title="开始一个新对话（当前对话将被自动保存）"
                >
                  新建
                </button>
              </div>
            </div>
            <div className="align-center flex max-w-3xl justify-center gap-2">
              <ul
                className="divide-y-2 divide-gray-500 overflow-auto"
              >
                {Array.from({ length: history.length / 2 }).map((_, index) => (
                  <li>
                    <span key={history.length - 2 - index * 2}>
                      {"❓ " + history[history.length - 2 - index * 2].content}
                    </span>
                    <br />
                    <span key={history.length - 1 - index * 2}>
                      {"🤖 " + history[history.length - 1 - index * 2].content}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
