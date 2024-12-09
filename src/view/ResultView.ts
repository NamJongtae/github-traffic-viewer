import { BaseView } from "./BaseView";
import { result, trafficTable } from "../template";
import { TrafficData } from "../types/trafficDataTypes";
import { $, formatDate } from "../utils";

export class ResultView extends BaseView {
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

  renderTrafficTable(data: TrafficData[]) {
    this.removeElement(".traffic-table");
    const hasData = data && data.length > 0;

    this.displayDownloadBtn();

    if (!hasData) {
      this.renderNoDataMessage();
      this.hideDownloadBtn();
      return;
    }

    this.removeElement(".no-data");
    $(".result")!.insertAdjacentHTML("beforeend", trafficTable);
    this.updateTableBody(data);
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
    $(".filters")!.insertAdjacentHTML(
      "afterend",
      `<div class="no-data">No data available.</div>`
    );
  }

  removeTrafficTable() {
    this.removeElement(".traffic-table");
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
    this.updateTrafficSummary(views, visitors);
    this.renderTrafficTable(data);
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
