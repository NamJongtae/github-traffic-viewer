import {
  getTrafficForm,
  layout,
  loadTrafficForm,
  mainMenu,
  result,
  trafficTable,
} from "../template";
import { TrafficData } from "../types/trafficDataTypes";
import { $, formatDate } from "../utils";

export class View {
  private rootEl: HTMLDivElement;

  constructor() {
    this.rootEl = document.querySelector("#app")!;
  }

  init(bindEvents: () => void) {
    this.renderLayout();
    this.renderMainMenu(() => bindEvents());
  }

  renderLayout() {
    this.rootEl.innerHTML = layout;
  }

  renderMainMenu(bindEvents: () => void) {
    $(".title")!.insertAdjacentHTML("afterend", mainMenu);
    bindEvents();
  }

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

  renderResult(data: TrafficData, bindEvents: () => void) {
    this.removeElement(".result");
    this.rootEl.insertAdjacentHTML("beforeend", result);
    this.renderTrafficTable(data);
    bindEvents();
  }

  renderTrafficTable(data: TrafficData) {
    this.removeElement(".traffic-table");
    const hasData = data && data.length > 0;

    if (!hasData) {
      this.renderNoDataMessage();
      return;
    }

    this.removeElement(".no-data");
    $(".filters")!.insertAdjacentHTML("afterend", trafficTable);
    this.updateTableBody(data);
  }

  removeTrafficTable() {
    this.removeElement(".traffic-table");
  }

  updateTableBody(data: TrafficData) {
    const tableBody = $(".traffic-body")!;
    data.forEach((view) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${formatDate(view.timestamp)}</td>
        <td>${view.count}</td>
        <td>${view.uniques}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  renderNoDataMessage() {
    $(".filters")!.insertAdjacentHTML(
      "afterend",
      `<div class="no-data">No data available.</div>`
    );
  }

  removeNoDataMessage() {
    this.removeElement(".no-data");
  }

  clearTrafficSummary() {
    $(".views")!.textContent = "0";
    $(".visitors")!.textContent = "0";
  }

  updateTrafficSummary(views: number, visitors: number) {
    $(".views")!.textContent = views.toString();
    $(".visitors")!.textContent = visitors.toString();
  }

  updateFilteredView(data: TrafficData, views: number, visitors: number) {
    this.updateTrafficSummary(views, visitors);
    this.renderTrafficTable(data);
  }

  renderErrorMsg(
    targetSelector: string,
    message: string,
    type: "form" | "filter" = "form"
  ) {
    const errorEl = $(".error-msg") as HTMLParagraphElement;
    if (errorEl) {
      errorEl.innerText = message;
    } else {
      $(targetSelector)!.insertAdjacentHTML(
        "afterend",
        `<p class=${
          type === "filter" ? "filter-error-msg" : "error-msg"
        }>${message}</p>`
      );
    }
  }

  removeErrorMsg(type: "form" | "filter" = "form") {
    this.removeElement(
      `${type === "filter" ? ".filter-error-msg" : ".error-msg"}`
    );
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

  // 이벤트 바인딩 메서드
  bindEvent<T extends HTMLElement>(
    element: T | null,
    event: string,
    callback: EventListener
  ) {
    if (element) {
      element.addEventListener(event, callback);
    }
  }

  bindEvents<T extends HTMLElement>(
    elements: NodeListOf<T>,
    event: string,
    callback: EventListener
  ) {
    elements.forEach((element) => this.bindEvent(element, event, callback));
  }

  removeElement(selector: string) {
    $(selector)?.remove();
  }
}
