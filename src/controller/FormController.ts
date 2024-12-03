import { LocalStorageModel } from "../model/LocalStorageModel";
import { TrafficDataModel } from "../model/TrafficDataModel";
import { $, generateFormErrorMsg } from "../utils";
import { FormView } from "../view/FormView";
import { MainMenuController } from './MainMenuController';
import { ResultController } from "./ResultController";

export class FormController {
  private mainMenuController!: MainMenuController; // 지연 초기화

  constructor(
    private trafficDataModel: TrafficDataModel,
    private localStorageModel: LocalStorageModel,
    private formView: FormView,
    private resultController: ResultController
  ) {}

  setDependency(mainMenuController: MainMenuController) {
    this.mainMenuController = mainMenuController;
  }

  handleGetTrafficClick() {
    this.formView.renderTrafficForm(() => this.bindTrafficFormEvents());
  }

  private bindTrafficFormEvents() {
    const form = $(".get-traffic-form") as HTMLFormElement;
    this.formView.bindEvent(form, "submit", (e) =>
      this.handleTrafficFormSubmit(e)
    );

    const inputs = document.querySelectorAll(
      ".input-group input"
    ) as NodeListOf<HTMLInputElement>;
    this.formView.bindEvents(inputs, "input", (event) => {
      const input = event.target as HTMLInputElement;
      const clearBtn = input.nextElementSibling as HTMLButtonElement;
      if (clearBtn) {
        this.bindInputClearEvents(input, clearBtn);
      }
    });

    inputs.forEach((input) => {
      const clearBtn = input.nextElementSibling as HTMLButtonElement;
      this.toggleClearButton(input, clearBtn);
    });

    const backBtn = $(".back-btn") as HTMLButtonElement;
    this.formView.bindEvent(backBtn, "click", () =>
      this.handleBackButtonClick()
    );
  }

  private async handleTrafficFormSubmit(event: Event) {
    event.preventDefault();

    const githubId = ($("#github-username") as HTMLInputElement).value;
    const githubToken = ($("#github-token") as HTMLInputElement).value;
    const repoName = ($("#repo-name") as HTMLInputElement).value;

    this.formView.activeFormLoading();

    try {
      const responseData = await this.trafficDataModel.fetchTrafficData(
        githubId,
        repoName,
        githubToken
      );

      const mergedData = await this.localStorageModel.mergeDataWithLocalStorage(
        repoName,
        responseData.views
      );

      this.trafficDataModel.setTrafficData(mergedData);
      // 2. 날짜별 데이터를 로컬스토리지에 저장
      for (const view of responseData.views) {
        this.localStorageModel.saveToLocalStorage(repoName, view.timestamp, view); // 날짜별 데이터 저장
      }

      this.resultController.renderResult(mergedData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const message = generateFormErrorMsg(error);
        this.formView.renderErrorMsg(".back-btn", message);
      }
    } finally {
      this.formView.inactiveFormLoading();
    }
  }

  handleLoadTrafficClick() {
    this.formView.renderLoadStorageTrafficForm(() =>
      this.bindLoadStorageTrafficFormEvents()
    );
  }

  private bindLoadStorageTrafficFormEvents() {
    const form = $(".load-traffic-form") as HTMLFormElement;
    this.formView.bindEvent(form, "submit", (e) =>
      this.handleLoadFormSubmit(e)
    );

    const input = $(".input-group input") as HTMLInputElement;
    const clearBtn = input.nextElementSibling as HTMLButtonElement;
    this.toggleClearButton(input, clearBtn);

    this.formView.bindEvent(input, "input", () => {
      this.bindInputClearEvents(input, clearBtn);
    });

    const backBtn = $(".back-btn") as HTMLButtonElement;
    this.formView.bindEvent(backBtn, "click", () =>
      this.handleBackButtonClick()
    );
  }

  private async handleLoadFormSubmit(event: Event) {
    event.preventDefault();

    const repoName = ($("#repo-name") as HTMLInputElement).value;
    const data = await this.localStorageModel.loadAllDataFromLocalStorage(repoName);

    if (data.length === 0) {
      this.formView.renderErrorMsg(
        ".back-btn",
        "The saved traffic data for this repository does not exist."
      );
      return;
    }

    this.trafficDataModel.setTrafficData(data);
    this.resultController.renderResult(data);
  }

  private bindInputClearEvents(
    input: HTMLInputElement,
    clearBtn: HTMLButtonElement
  ) {
    clearBtn.style.display = input.value ? "block" : "none";
    this.formView.bindEvent(clearBtn, "click", () => {
      input.value = "";
      clearBtn.style.display = "none";
    });
  }

  private toggleClearButton(
    input: HTMLInputElement,
    button: HTMLButtonElement
  ) {
    button.style.display = input.value ? "block" : "none";
  }

  private handleBackButtonClick() {
    this.formView.removeElement(".get-traffic-form");
    this.formView.removeElement(".load-traffic-form");
    this.formView.removeElement(".result");
    this.mainMenuController.handleMainMenuRender();
  }
}
