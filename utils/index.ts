export async function wrappedWriteClipboard(str: string) {
  try {
    await navigator.clipboard.writeText(str);
  } catch (e) {
    console.warn(e);

    const textArea = document.createElement("textarea");
    textArea.value = str;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    // Use deprecated `execCommand` as fallback
    const success = document.execCommand("copy");
    if (!success) {
      document.body.removeChild(textArea);
      throw new Error("Failed to write to clipboard.");
    }
    document.body.removeChild(textArea);
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
