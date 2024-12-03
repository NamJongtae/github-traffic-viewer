import { $ } from "../utils";
import { MainMenuView } from "../view/MainMenuView";
import { FormController } from "./FormController";

export class MainMenuController {
  private trafficFormController!: FormController; // 지연 초기화

  constructor(private mainMenuView: MainMenuView) {
    this.init();
  }

  setDependency(trafficFormController: FormController) {
    this.trafficFormController = trafficFormController;
  }

  init() {
    this.mainMenuView.renderLayout();
    this.mainMenuView.renderMainMenu(() => this.bindMainMenuEvents());
  }

  bindMainMenuEvents() {
    const getTrafficBtn = $(".get-traffic-btn") as HTMLButtonElement;
    this.mainMenuView.bindEvent(getTrafficBtn, "click", () =>
      this.trafficFormController.handleGetTrafficClick()
    );

    const loadTrafficBtn = $(".load-traffic-btn") as HTMLButtonElement;
    this.mainMenuView.bindEvent(loadTrafficBtn, "click", () =>
      this.trafficFormController.handleLoadTrafficClick()
    );
  }

  handleMainMenuRender() {
    this.mainMenuView.renderMainMenu(() => this.bindMainMenuEvents());
  }
}
