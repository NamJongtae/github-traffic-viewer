// DOM element selector
export function $(selector: string) {
  const rootEl = document.querySelector("#app") as HTMLDivElement;
  return rootEl.querySelector(selector);
}

// 에러 메시지 생성
export function generateFormErrorMsg(error: Error) {
  let message = "Something went wrong. Please try again later.";
  if (error.message.includes("401")) {
    message = "Please check your Access Token.";
  } else if (error.message.includes("404")) {
    message = "Please check your GitHub username or repository name.";
  }

  return message;
}
