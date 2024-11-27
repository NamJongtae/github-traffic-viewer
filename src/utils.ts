// DOM element selector
export function $(selector: string) {
  const rootEl = document.querySelector("#app") as HTMLDivElement;
  return rootEl.querySelector(selector);
}
