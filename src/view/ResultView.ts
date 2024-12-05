import { BaseView } from "./BaseView";
import { result, trafficTable } from "../template";
import { TrafficData } from "../types/trafficDataTypes";
import { $, formatDate } from "../utils";

export class ResultView extends BaseView {
  renderResult(data: TrafficData[], repoName:string, bindEvents: () => void) {
    this.removeElement(".result");
    this.rootEl.insertAdjacentHTML("beforeend", result);
    this.updateTrafficDataTitle(repoName)
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

    this.displayDownloadBtns();

    if (!hasData) {
      this.renderNoDataMessage();
      this.hideDownloadBtns();
      return;
    }

    this.removeElement(".no-data");
    $(".filters")!.insertAdjacentHTML("afterend", trafficTable);
    this.updateTableBody(data);
  }

  updateTableBody(data: TrafficData[]) {
    const tableBody = $(".traffic-body")!;
    data.forEach((view) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${view.date}</td>
        <td>${view.views}</td>
        <td>${view.unique_vistior}</td>
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
    $(".views")!.textContent = views.toString();
    $(".visitors")!.textContent = visitors.toString();
  }

  updateFilteredView(data: TrafficData[], views: number, visitors: number) {
    this.updateTrafficSummary(views, visitors);
    this.renderTrafficTable(data);
  }

  hideDownloadBtns() {
    ($(".download-btn-group") as HTMLDivElement).style.display = "none";
  }

  displayDownloadBtns() {
    ($(".download-btn-group") as HTMLDivElement).style.display = "flex";
  }
}
