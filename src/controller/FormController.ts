import { EventBus } from "../EventBus";
import { LocalStorageModel } from "../model/LocalStorageModel";
import { TrafficDataModel } from "../model/TrafficDataModel";
import { EventMap } from "../types/EventMap";
import { TrafficData } from "../types/trafficDataTypes";
import {
  $,
  generateFormErrorMsg,
  readExcelFile,
  readJsonFile,
  readTxtFile,
} from "../utils";
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
    this.eventBus.subscribe("initializeDeleteTrafficForm", () => {
      this.initializeDeleteTrafficForm();
    });
    this.eventBus.subscribe("initializeUploadTrafficForm", () => {
      this.initializeUploadTrafficForm();
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

    this.formView.removeErrorMsg();
    this.formView.activeFormLoading("Loading Traffic Data...");

    try {
      const responseData = await this.trafficDataModel.fetchTrafficData(
        githubId,
        repoName,
        githubToken
      );

      const transformData = responseData.views.map((view) => ({
        date: new Date(view.timestamp).toISOString().split("T")[0],
        views: view.count,
        unique_visitors: view.uniques,
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
        this.formView.renderErrorMsg("form", message);
      }
    } finally {
      this.formView.inactiveFormLoading("Get Traffic Data");
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
    this.formView.removeErrorMsg();
    this.formView.activeFormLoading("Loading Storage Data...");

    try {
      const data = await this.localStorageModel.loadAllDataFromLocalStorage(
        repoName
      );

      if (data.length === 0) {
        this.formView.renderErrorMsg(
          "form",
          "The saved traffic data for this repository does not exist."
        );
        return;
      }

      this.trafficDataModel.setTrafficData(data);
      this.eventBus.publish("initializeResult", data, repoName);
    } catch (error) {
      if (error instanceof Error) {
        this.formView.renderErrorMsg("form", error.message);
      }
    } finally {
      this.formView.inactiveFormLoading("Load Storage Data");
    }
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

  private initializeDeleteTrafficForm() {
    this.formView.renderDeleteTrafficForm(() =>
      this.bindDeleteTrafficFormEvents()
    );
    this.loadRepoListAndCreateOptions();
  }

  private bindDeleteTrafficFormEvents() {
    const form = $(".delete-traffic-form") as HTMLFormElement;
    this.formView.bindEvent(form, "submit", (e) =>
      this.handleDeleteFormSubmit(e)
    );

    const backBtn = $(".back-btn") as HTMLButtonElement;
    this.formView.bindEvent(backBtn, "click", () =>
      this.handleBackButtonClick()
    );
  }

  private async handleDeleteFormSubmit(e: Event) {
    e.preventDefault();

    const repoName = ($("#repo-selector") as HTMLSelectElement).value;
    this.formView.removeErrorMsg();
    this.formView.activeFormLoading("Deleting Storage Data...");

    try {
      const isDelete = confirm(
        `Are you sure you want to delete the traffic data for ${repoName}?`
      );
      if (!isDelete) {
        return;
      }
      await this.localStorageModel.deleteAllDataForRepo(repoName);
      this.formView.resetRepoSelector();
      this.loadRepoListAndCreateOptions();
    } catch (error) {
      if (error instanceof Error) {
        this.formView.renderErrorMsg("form", error.message);
      }
    } finally {
      this.formView.inactiveFormLoading("Delete Storage Data");
    }
  }

  private async loadRepoListAndCreateOptions() {
    try {
      const repoList = await this.localStorageModel.getRepoList();
      this.formView.createRepoListOption(repoList);
    } catch (error) {
      console.error("Failed to get repository list:", error);
    }
  }

  private bindUploadTrafficForm() {
    const form = $(".upload-traffic-form") as HTMLFormElement;
    this.formView.bindEvent(form, "submit", (e) =>
      this.handleUploadFormSubmit(e)
    );

    const repoNameInput = $("#repo-name") as HTMLInputElement;
    this.formView.bindEvent(repoNameInput, "input", (event) => {
      const input = event.target as HTMLInputElement;
      const clearBtn = input.nextElementSibling as HTMLButtonElement;
      if (clearBtn) {
        this.bindInputClearEvents(input, clearBtn);
      }
    });

    const clearBtn = repoNameInput.nextElementSibling as HTMLButtonElement;
    this.formView.toggleClearButton(repoNameInput, clearBtn);

    const backBtn = $(".back-btn") as HTMLButtonElement;
    this.formView.bindEvent(backBtn, "click", () =>
      this.handleBackButtonClick()
    );
  }

  private initializeUploadTrafficForm() {
    this.formView.renderUploadTrafficFrom(() => this.bindUploadTrafficForm());
  }

  private async handleUploadFormSubmit(e: Event) {
    e.preventDefault();

    const fileInput = document.getElementById("uploader") as HTMLInputElement;
    const repoNameInput = document.getElementById(
      "repo-name"
    ) as HTMLInputElement;

    const repoName = repoNameInput.value.trim();

    if (!repoName) {
      alert("Please enter a repository name.");
      this.formView.inactiveFormLoading("Upload Traffic Data");
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      this.formView.renderErrorMsg("form", "No file selected.");
      this.formView.inactiveFormLoading("Upload Traffic Data");
      return;
    }

    const file = fileInput.files[0];
    const fileType = file.name.split(".").pop()?.toLowerCase();

    if (file.size > 100 * 1024) {
      this.formView.renderErrorMsg("form", "File size exceeds 100KB limit.");
      fileInput.value = "";
      return;
    }

    this.formView.removeErrorMsg();
    this.formView.activeFormLoading("Uploading Traffic Data...");

    try {
      let data: TrafficData[];

      if (fileType === "json") {
        data = await readJsonFile(file);
      } else if (fileType === "xlsx") {
        data = await readExcelFile(file);
      } else if (fileType === "txt") {
        data = await readTxtFile(file);
      } else {
        this.formView.renderErrorMsg("form", "File size exceeds 100KB limit.");
        fileInput.value = "";
        return;
      }

      await this.localStorageModel.saveUploadedTrafficData(repoName, data);
      alert(
        `Data has been successfully uploaded and stored for "${repoName}".`
      );
    } catch (error) {
      console.error("Error processing the file:", error);
      this.formView.renderErrorMsg(
        "form",
        "Failed to upload and process the file."
      );
    } finally {
      this.formView.inactiveFormLoading("Upload Traffic Data");
      this.formView.resetUplaodForm();
    }
  }

  private handleBackButtonClick() {
    this.formView.removeElement(".get-traffic-form");
    this.formView.removeElement(".load-traffic-form");
    this.formView.removeElement(".delete-traffic-form");
    this.formView.removeElement(".upload-traffic-form");
    this.formView.removeElement(".result");
    this.eventBus.publish("initializeMainMenu");
  }
}
