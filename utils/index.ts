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
