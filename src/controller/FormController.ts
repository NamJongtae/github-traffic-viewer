import { EventBus } from "../EventBus";
import { LocalStorageModel } from "../model/LocalStorageModel";
import { TrafficDataModel } from "../model/TrafficDataModel";
import { EventMap } from "../types/EventMap";
import { $, generateFormErrorMsg } from "../utils";
import { FormView } from "../view/FormView";

export class FormController {
  constructor(
    private trafficDataModel: TrafficDataModel,
    private localStorageModel: LocalStorageModel,
    private formView: FormView,
    private eventBus: EventBus<EventMap>
  ) {
    this.initialized();
  }

  private initialized() {
    this.eventBus.subscribe("initializeGetTrafficForm", () => {
      this.initializeGetTrafficForm();
    });
    this.eventBus.subscribe("initializeLoadTrafficForm", () => {
      this.initializeLoadTrafficForm();
    });
  }

  initializeGetTrafficForm() {
    this.formView.renderGetTrafficForm(() => this.bindTrafficFormEvents());
  }

  private bindTrafficFormEvents() {
    const form = $(".get-traffic-form") as HTMLFormElement;
    this.formView.bindEvent(form, "submit", (e) =>
      this.handleGetTrafficFormSubmit(e)
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
      this.formView.toggleClearButton(input, clearBtn);
    });

    const backBtn = $(".back-btn") as HTMLButtonElement;
    this.formView.bindEvent(backBtn, "click", () =>
      this.handleBackButtonClick()
    );
  }

  private async handleGetTrafficFormSubmit(event: Event) {
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

      const transformData = responseData.views.map((view) => ({
        date: new Date(view.timestamp).toISOString().split("T")[0],
        views: view.count,
        unique_vistior: view.uniques,
      }));

      const mergedData = await this.localStorageModel.mergeDataWithLocalStorage(
        repoName,
        transformData
      );

      this.trafficDataModel.setTrafficData(mergedData);

      const savePromises = transformData.map((data) =>
        this.localStorageModel.saveToLocalStorage(repoName, data.date, data)
      );

      await Promise.all(savePromises);

      this.eventBus.publish("initializeResult", mergedData, repoName);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const message = generateFormErrorMsg(error);
        this.formView.renderErrorMsg(".back-btn", message);
      }
    } finally {
      this.formView.inactiveFormLoading();
    }
  }

  private initializeLoadTrafficForm() {
    this.formView.renderLoadTrafficForm(() => this.bindLoadTrafficFormEvents());
    this.loadRepoListAndCreateOptions();
  }

  private bindLoadTrafficFormEvents() {
    const form = $(".load-traffic-form") as HTMLFormElement;
    this.formView.bindEvent(form, "submit", (e) =>
      this.handleLoadFormSubmit(e)
    );

    const backBtn = $(".back-btn") as HTMLButtonElement;
    this.formView.bindEvent(backBtn, "click", () =>
      this.handleBackButtonClick()
    );
  }

  private async handleLoadFormSubmit(event: Event) {
    event.preventDefault();

    const repoName = ($("#repo-selector") as HTMLSelectElement).value;
    const data = await this.localStorageModel.loadAllDataFromLocalStorage(
      repoName
    );

    if (data.length === 0) {
      this.formView.renderErrorMsg(
        ".back-btn",
        "The saved traffic data for this repository does not exist."
      );
      return;
    }

    this.trafficDataModel.setTrafficData(data);
    this.eventBus.publish("initializeResult", data, repoName);
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

  private async loadRepoListAndCreateOptions() {
    try {
      const repoList = await this.localStorageModel.getRepoList();
      this.formView.createRepoListOption(repoList);
    } catch (error) {
      console.error("Failed to get repository list:", error);
    }
  }

  private handleBackButtonClick() {
    this.formView.removeElement(".get-traffic-form");
    this.formView.removeElement(".load-traffic-form");
    this.formView.removeElement(".result");
    this.eventBus.publish("initializeMainMenu");
  }
}
