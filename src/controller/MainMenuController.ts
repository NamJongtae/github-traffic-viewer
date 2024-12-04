import { EventBus } from "../EventBus";
import { EventMap } from "../types/EventMap";
import { $ } from "../utils";
import { MainMenuView } from "../view/MainMenuView";

export class MainMenuController {
  constructor(
    private mainMenuView: MainMenuView,
    private eventBus: EventBus<EventMap>
  ) {
    this.initialized();
    this.mainMenuView.renderLayout();
    this.initializeMainMenu();
  }

  initialized() {
    this.eventBus.subscribe("initializeMainMenu", () => {
      this.initializeMainMenu();
    });
  }

  initializeMainMenu() {
    this.mainMenuView.renderMainMenu(() => this.bindMainMenuEvents());
  }

  bindMainMenuEvents() {
    const getTrafficBtn = $(".get-traffic-btn") as HTMLButtonElement;
    this.mainMenuView.bindEvent(getTrafficBtn, "click", () =>
      this.handleGetTrafficBtnClick()
    );

    const loadTrafficBtn = $(".load-traffic-btn") as HTMLButtonElement;
    this.mainMenuView.bindEvent(loadTrafficBtn, "click", () =>
      this.handleLoadTrafficBtnClick()
    );

    const goToDocsBtn = $(".docs-btn") as HTMLButtonElement;
    this.mainMenuView.bindEvent(goToDocsBtn, "click", () => {
      this.handleGoToDocsBtnClick();
    });
  }

  private handleGetTrafficBtnClick() {
    this.eventBus.publish("initializeGetTrafficForm");
  }

  private handleLoadTrafficBtnClick() {
    this.eventBus.publish("initializeLoadTrafficForm");
  }

  private handleGoToDocsBtnClick() {
    window.open(
      "https://github.com/NamJongtae/github-traffic-viewer",
      "docs",
      "width=500 height=700"
    );
  }
}
