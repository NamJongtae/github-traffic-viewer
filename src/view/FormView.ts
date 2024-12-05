import { BaseView } from "./BaseView";
import {
  deleteTrafficForm,
  getTrafficForm,
  loadTrafficForm,
} from "../template";
import { $ } from "../utils";

export class FormView extends BaseView {
  renderGetTrafficForm(bindEvents: () => void) {
    this.removeElement(".main-menu");
    $(".title")!.insertAdjacentHTML("afterend", getTrafficForm);
    bindEvents();
  }

  renderLoadTrafficForm(bindEvents: () => void) {
    this.removeElement(".main-menu");
    $(".title")!.insertAdjacentHTML("afterend", loadTrafficForm);
    bindEvents();
  }

  renderDeleteTrafficForm(bindEvent: () => void) {
    this.removeElement(".main-menu");
    $(".title")!.insertAdjacentHTML("afterend", deleteTrafficForm);
    bindEvent();
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
    const repoSelector = $(
      "#repo-selector"
    ) as HTMLSelectElement;

    Array.from(repoSelector.options)
      .filter((option) => option.value !== "")
      .forEach((option) => option.remove());

    repoSelector.value = repoSelector.options[0].value;
  }

  toggleClearButton(input: HTMLInputElement, button: HTMLButtonElement) {
    button.style.display = input.value ? "block" : "none";
  }

  activeFormLoading() {
    const submitBtnEl = $(".submit-btn") as HTMLButtonElement;
    submitBtnEl.textContent = "Loading Traffic Data...";
    submitBtnEl.style.opacity = "0.5";
    submitBtnEl.style.pointerEvents = "none";
  }

  inactiveFormLoading() {
    const submitBtnEl = $(".submit-btn") as HTMLButtonElement;
    submitBtnEl.textContent = "Get Traffic Data";
    submitBtnEl.style.opacity = "1";
    submitBtnEl.style.pointerEvents = "auto";
  }
}
