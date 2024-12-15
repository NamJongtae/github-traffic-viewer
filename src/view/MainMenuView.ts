import { BaseView } from './BaseView';
import { mainMenu } from "../template";
import { $ } from "../utils";

export class MainMenuView extends BaseView {
  renderMainMenu(bindEvents: () => void) {
    $("header")!.insertAdjacentHTML("afterend", mainMenu);
    bindEvents();
  }
}
