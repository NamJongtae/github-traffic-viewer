import { layout } from "../template";
import { $ } from "../utils";

export class BaseView {
  protected rootEl: HTMLElement;

  constructor() {
    this.rootEl = document.querySelector("#app")!;
  }

  renderLayout() {
    this.rootEl.innerHTML = layout;
  }

  renderErrorMsg(type: "form" | "filter", message: string) {
    const errorEl = $(".error-msg") as HTMLParagraphElement;
    if (errorEl) {
      errorEl.innerText = message;
      return;
    }

    if (type === "form") {
      $(".input-group:last-of-type")!.insertAdjacentHTML(
        "afterend",
        `<p class=error-msg>${message}</p>`
      );
    } else {
      $(".filters")!.insertAdjacentHTML(
        "afterend",
        `<p class=filter-error-msg>${message}</p>`
      );
    }
  }

  removeErrorMsg(type: "form" | "filter" = "form") {
    this.removeElement(
      `${type === "filter" ? ".filter-error-msg" : ".error-msg"}`
    );
  }

  removeNoDataMessage() {
    this.removeElement(".no-data");
  }

  removeElement(selector: string) {
    $(selector)?.remove();
  }

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
}
