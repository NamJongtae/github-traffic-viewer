import { getTrafficForm, layout, loadTrafficForm, mainMenu } from "../template";
import { $ } from "../utils";

const rootEl = document.querySelector("#app")!;

export class View {
  init(bindEvents: () => void) {
    this.renderLayout();
    this.renderMainMenu(() => bindEvents());
  }

  renderLayout() {
    rootEl.innerHTML = layout;
  }

  renderMainMenu(bindEvents: () => void) {
    $(".title")!.insertAdjacentHTML("afterend", mainMenu);
    bindEvents();
  }

  renderGetTrafficForm(bindEvents: () => void) {
    this.removeElement(".main-menu");
    $(".title")!.insertAdjacentHTML("afterend", getTrafficForm);
    bindEvents();
  }

  renderLoadTrafficForm(bindEvents: () => void) {
    this.removeElement(".main-menu");
    $(".title")!.insertAdjacentHTML("afterend", loadTrafficForm);
    bindEvents();
  }

  renderErrorMsg(targetSelector: string, message: string) {
    const errorEl = $(".error-msg") as HTMLParagraphElement;
    if (errorEl) {
      errorEl.innerText = message;
    } else {
      $(targetSelector)!.insertAdjacentHTML(
        "afterend",
        `<p class="error-msg"}>${message}</p>`
      );
    }
  }

  clearErrorMsg(type: "form" | "filter" = "form") {
    this.removeElement(
      `${type === "filter" ? ".filter-error-msg" : "error-msg"}`
    );
  }

  activeFormLoading() {
    const submitBtnEl = $(".submit-btn") as HTMLButtonElement;
    submitBtnEl.textContent = "Loading Traffic Data...";
    submitBtnEl.style.opacity = "0.5";
    submitBtnEl.style.pointerEvents = "none";
  }

  inactiveFormLoading() {
    const submitBtnEl = $(".submit-btn") as HTMLButtonElement;
    submitBtnEl.textContent = "Get Traffic Data";
    submitBtnEl.style.opacity = "1";
    submitBtnEl.style.pointerEvents = "auto";
  }

  // 이벤트 바인딩 메서드
  bindEvent<T extends HTMLElement>(
    element: T | null,
    event: string,
    callback: EventListener
  ) {
    if (element) {
      element.addEventListener(event, callback);
    }
  }

  bindEvents<T extends HTMLElement>(
    elements: NodeListOf<T>,
    event: string,
    callback: EventListener
  ) {
    elements.forEach((element) => this.bindEvent(element, event, callback));
  }

  removeElement(selector: string) {
    $(selector)?.remove();
  }
}
