import { BaseView } from "./BaseView";
import {
  deleteTrafficForm,
  getTrafficForm,
  loadTrafficForm,
  uploadTrafficForm,
} from "../template";
import { $ } from "../utils";

export class FormView extends BaseView {
  renderGetTrafficForm(bindEvents: () => void) {
    this.removeElement(".main-menu");
    $("header")!.insertAdjacentHTML("afterend", getTrafficForm);
    bindEvents();
  }

  renderLoadTrafficForm(bindEvents: () => void) {
    this.removeElement(".main-menu");
    $("header")!.insertAdjacentHTML("afterend", loadTrafficForm);
    bindEvents();
  }

  renderDeleteTrafficForm(bindEvent: () => void) {
    this.removeElement(".main-menu");
    $("header")!.insertAdjacentHTML("afterend", deleteTrafficForm);
    bindEvent();
  }

  renderUploadTrafficFrom(bindEvents: () => void) {
    this.removeElement(".main-menu");
    $("header")!.insertAdjacentHTML("afterend", uploadTrafficForm);
    bindEvents();
  }

  createRepoListOption(repoList: { lastUpdated: string; repoName: string }[]) {
    const repoSelector = $("#repo-selector") as HTMLSelectElement;

    if (repoList.length > 0) {
      repoList.forEach((data) => {
        const option = document.createElement("option");
        option.value = data.repoName;
        option.textContent = data.repoName;
        option.dataset.lastupdated = data.lastUpdated;
        repoSelector.appendChild(option);
      });
    } else {
      const noDataOption = document.createElement("option");
      noDataOption.value = "";
      noDataOption.textContent = "No repositories found";
      noDataOption.disabled = true;
      repoSelector.appendChild(noDataOption);
    }
  }

  resetRepoSelector() {
    const repoSelector = $("#repo-selector") as HTMLSelectElement;

    Array.from(repoSelector.options)
      .filter((option) => option.value !== "")
      .forEach((option) => option.remove());

    repoSelector.value = repoSelector.options[0].value;
  }

  resetUplaodForm() {
    const uploadForm = $(".upload-traffic-form") as HTMLFormElement;
    uploadForm.reset();
    const clearBtn = $(".clear-btn") as HTMLButtonElement;
    clearBtn.style.display = "none";
  }

  toggleClearButton(input: HTMLInputElement, button: HTMLButtonElement) {
    button.style.display = input.value ? "block" : "none";
  }

  activeFormLoading(text: string) {
    const submitBtnEl = $(".submit-btn") as HTMLButtonElement;
    submitBtnEl.textContent = text;
    submitBtnEl.style.opacity = "0.5";
    submitBtnEl.style.pointerEvents = "none";
  }

  inactiveFormLoading(text: string) {
    const submitBtnEl = $(".submit-btn") as HTMLButtonElement;
    submitBtnEl.textContent = text;
    submitBtnEl.style.opacity = "1";
    submitBtnEl.style.pointerEvents = "auto";
  }
}
