import { layout, mainMenu } from '../template';
import { $ } from '../utils';

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
}
