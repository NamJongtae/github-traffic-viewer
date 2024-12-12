import { BaseView } from "./BaseView";
import { result, trafficChart, trafficTable } from "../template";
import { TrafficData } from "../types/trafficDataTypes";
import { $, formatDate } from "../utils";
import { ChartManager } from "../ChartManager";

export class ResultView extends BaseView {
  chartManager = new ChartManager();

  renderResult(data: TrafficData[], repoName: string, bindEvents: () => void) {
    this.removeElement(".result");
    const header = $("header") as HTMLHeadingElement;
    header.insertAdjacentHTML("afterend", result);
    this.updateTrafficDataTitle(repoName);
    this.renderTrafficTable(data);
    this.updateLastUpdated();
    bindEvents();
  }

  private updateTrafficDataTitle(repoName: string) {
    $(".traffic-data-title .repo-name")!.textContent = repoName;
  }

  private updateLastUpdated() {
    const repoSelector = $("#repo-selector");
    const lastUpdatedTimeEl = $(".last-updated-time") as HTMLTimeElement;

    if (repoSelector instanceof HTMLSelectElement) {
      const selectedOption = repoSelector.options[repoSelector.selectedIndex];
      const lastUpdatedTime = selectedOption.dataset.lastupdated || "0";

      lastUpdatedTimeEl.textContent = formatDate(lastUpdatedTime);
      lastUpdatedTimeEl.dateTime = lastUpdatedTime;
    } else {
      const now = new Date().toISOString();
      lastUpdatedTimeEl.textContent = formatDate(now);
      lastUpdatedTimeEl.dateTime = now;
    }
  }

  renderTrafficView(type: "table" | "chart", data: TrafficData[]) {
    this.removeElement(`.traffic-${type}`);
    const hasData = data && data.length > 0;

    this.removeNoDataMessage();
    this.displayDownloadBtn();

    if (!hasData) {
      this.renderNoDataMessage();
      this.hideDownloadBtn();
      return;
    }

    $(".result")!.insertAdjacentHTML(
      "beforeend",
      type === "table" ? trafficTable : trafficChart
    );
    if (type === "table") {
      this.updateTableBody(data);
    } else {
      this.chartManager.createChart(data);
    }
  }

  renderTrafficTable(data: TrafficData[]) {
    this.renderTrafficView("table", data);
  }

  renderTrafficChart(data: TrafficData[]) {
    this.renderTrafficView("chart", data);
  }

  changeView(data: TrafficData[]) {
    const changeViewBtn = $(".change-view-btn") as HTMLButtonElement;

    let viewType = changeViewBtn.dataset.viewtype;

    if (viewType === "table") {
      changeViewBtn.dataset.viewtype = "chart";
      this.removeElement(".traffic-table");
      this.renderTrafficChart(data);
      changeViewBtn.textContent = "Table View";
    } else {
      changeViewBtn.dataset.viewtype = "table";
      this.removeElement(".traffic-chart");
      this.renderTrafficTable(data);
      changeViewBtn.textContent = "Chart View";
    }
  }

  updateTableBody(data: TrafficData[]) {
    const tableBody = $(".traffic-body")!;
    data.forEach((view) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${view.date}</td>
        <td>${view.views.toLocaleString()}</td>
        <td>${view.unique_visitors.toLocaleString()}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  renderNoDataMessage() {
    $(".close-btn")!.insertAdjacentHTML(
      "beforebegin",
      `<div class="no-data">No data available.</div>`
    );
  }

  removeTrafficTable() {
    this.removeElement(".traffic-table");
  }

  removeTrafficChart() {
    this.removeElement(".traffic-chart");
  }

  removeNoDataMessage() {
    this.removeElement(".no-data");
  }

  clearTrafficSummary() {
    $(".views")!.textContent = "0";
    $(".visitors")!.textContent = "0";
  }

  updateTrafficSummary(views: number, visitors: number) {
    $(".views")!.textContent = views.toLocaleString();
    $(".visitors")!.textContent = visitors.toLocaleString();
  }

  updateFilteredView(data: TrafficData[], views: number, visitors: number) {
    const viewType = ($(".change-view-btn") as HTMLButtonElement).dataset
      .viewtype;
    this.updateTrafficSummary(views, visitors);
    if (viewType === "table") {
      this.renderTrafficTable(data);
    } else {
      this.renderTrafficChart(data);
    }
  }

  hideDownloadBtn() {
    ($(".download-btn") as HTMLDivElement).style.display = "none";
  }

  displayDownloadBtn() {
    ($(".download-btn") as HTMLDivElement).style.display = "flex";
  }

  closeResult() {
    this.removeElement(".result-wrapper");
  }
}
