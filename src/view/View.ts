import { layout, mainMenu } from "../template";
import { $ } from "../utils";

const rootEl = document.querySelector("#app")!;

export class View {
  init() {
    this.renderLayout();
    this.renderMainMenu();
  }

  renderLayout() {
    rootEl.innerHTML = layout;
  }

  renderMainMenu() {
    $(".title")!.insertAdjacentHTML("afterend", mainMenu);
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
}
