export async function wrappedReadClipboard() {
  if (typeof navigator.clipboard === "undefined") {
    const textArea = document.createElement("textarea");
    textArea.value = "";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let historyStr: string;
    if (document.execCommand("paste")) {
      historyStr = textArea.value;
    } else {
      // Use prompt as a fallback
      historyStr = window.prompt("请将需要导入的历史记录粘贴在这里：");
    }
    document.body.removeChild(textArea);
    return historyStr;
  } else {
    return await navigator.clipboard.readText();
  }
}

export async function wrappedWriteClipboard(str: string) {
  if (typeof navigator.clipboard === "undefined") {
    const textArea = document.createElement("textarea");
    textArea.value = str;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const success = document.execCommand("copy");
    if (!success) {
      throw new Error("Failed to write to clipboard.");
    }
    document.body.removeChild(textArea);
  } else {
    return await navigator.clipboard.writeText(str);
  }
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function getSummary(uid) {
  if (
    localStorage.getItem(uid) === null ||
    localStorage.getItem(uid) === "[]"
  ) {
    return "空白对话";
  } else {
    return (
      JSON.parse(localStorage.getItem(uid))[0].content.substr(0, 20) + "..."
    );
  }
}

interface HistoryRecord {
  index: string;
  messages: string;
}

export async function exportHistory() {
  const indices = JSON.parse(
    localStorage.getItem("my-chatgpt-indices") || "[]"
  );
  const history = [];
  for (const index of indices) {
    const messages = localStorage.getItem(index) || "[]";
    history.push({ index, messages });
  }
  await wrappedWriteClipboard(JSON.stringify(history));
}

export async function importHistory() {
  try {
    const historyStr = await wrappedReadClipboard();
    const history: HistoryRecord[] = JSON.parse(historyStr);
    const indices = JSON.parse(
      localStorage.getItem("my-chatgpt-indices") || "[]"
    );
    for (const { index, messages } of history) {
      if (indices.findIndex((id) => id === index) === -1) {
        indices.push(index);
        localStorage.setItem(index, messages);
      }
    }
    localStorage.setItem("my-chatgpt-indices", JSON.stringify(indices));
    return indices;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function clearHistory() {
  const indices = JSON.parse(
    localStorage.getItem("my-chatgpt-indices") || "[]"
  );
  for (const index of indices) {
    localStorage.removeItem(index);
  }
  localStorage.setItem("my-chatgpt-indices", "[]");
}
