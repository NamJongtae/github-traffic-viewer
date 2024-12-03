import { BaseView } from './BaseView';
import { getTrafficForm, loadTrafficForm } from "../template";
import { $ } from "../utils";

export class FormView extends BaseView {
  renderTrafficForm(bindEvents: () => void) {
    this.removeElement(".main-menu");
    $(".title")!.insertAdjacentHTML("afterend", getTrafficForm);
    bindEvents();
  }

  renderLoadStorageTrafficForm(bindEvents: () => void) {
    this.removeElement(".main-menu");
    $(".title")!.insertAdjacentHTML("afterend", loadTrafficForm);
    bindEvents();
  }

  activeFormLoading() {
    const submitBtnEl = document.querySelector(".submit-btn") as HTMLButtonElement;
    submitBtnEl.textContent = "Loading Traffic Data...";
    submitBtnEl.style.opacity = "0.5";
    submitBtnEl.style.pointerEvents = "none";
  }

  inactiveFormLoading() {
    const submitBtnEl = document.querySelector(".submit-btn") as HTMLButtonElement;
    submitBtnEl.textContent = "Get Traffic Data";
    submitBtnEl.style.opacity = "1";
    submitBtnEl.style.pointerEvents = "auto";
  }
}
