import { EventBus } from "../EventBus";
import { TrafficDataModel } from "../model/TrafficDataModel";
import { EventMap } from "../types/EventMap";
import { TrafficData } from "../types/trafficDataTypes";
import { $, downloadExcel, downloadJson, downloadTxt, validateDates } from "../utils";
import { ResultView } from "../view/ResultView";

export class ResultController {
  constructor(
    private trafficDataModel: TrafficDataModel,
    private resultView: ResultView,
    private eventBus: EventBus<EventMap>
  ) {
    this.initialized();
  }

  initialized() {
    this.eventBus.subscribe("initializeResult", (data, repoName) => {
      this.initializeResult(data, repoName);
    });
  }

  private initializeResult(data: TrafficData[], repoName: string) {
    this.resultView.removeElement(".error-msg");
    this.resultView.renderResult(data, repoName, () => this.bindResultEvents());
    const { views, visitors } =
      this.trafficDataModel.calculateTotalTraffic(data);

    this.resultView.updateTrafficSummary(views, visitors);
  }

  private bindResultEvents() {
    const startDateInput = $("#start-date") as HTMLInputElement;
    this.resultView.bindEvent(startDateInput, "input", () =>
      this.handleFilterChange()
    );

    const endDateInput = $("#end-date") as HTMLInputElement;
    this.resultView.bindEvent(endDateInput, "input", () =>
      this.handleFilterChange()
    );
    const today = new Date().toISOString().split("T")[0];
    endDateInput.setAttribute("max", today);

    const sortOrderSelect = $("#sort-order") as HTMLSelectElement;
    this.resultView.bindEvent(sortOrderSelect, "input", () =>
      this.handleFilterChange()
    );

    const downloadBtnGroup = $(".download-btn-group") as HTMLButtonElement;
    const downloadFormatSelectorEl = $("#download-format") as HTMLSelectElement;
    this.resultView.bindEvent(downloadBtnGroup, "click", () => {
      const selectedFormat = downloadFormatSelectorEl.value;
      const startDate = startDateInput.value;
      const endDate = endDateInput.value;
      const data = this.trafficDataModel.filterDataByDate(startDate, endDate);

      if (selectedFormat === "json") {
        downloadJson(data);
      } else if (selectedFormat === "excel") {
        downloadExcel(data);
      } else {
        downloadTxt(data)
      }
    });
    this.resultView.bindEvent(downloadFormatSelectorEl, "click", (e: Event) => {
      e.stopPropagation();
    });
  }

  private handleFilterChange() {
    const startDate = ($("#start-date") as HTMLInputElement).value;
    const endDate = ($("#end-date") as HTMLInputElement).value;
    const sortOrder = ($("#sort-order") as HTMLSelectElement).value;

    this.resultView.removeErrorMsg("filter");
    this.resultView.removeNoDataMessage();

    const isValidDate = validateDates(startDate, endDate);

    if (!isValidDate) {
      this.resultView.renderErrorMsg(
        ".filters",
        "Start Date cannot be later than End Date.",
        "filter"
      );
      this.resultView.clearTrafficSummary();
      this.resultView.removeTrafficTable();
      this.resultView.hideDownloadBtns();
      return;
    }

    const filteredAndSortedData =
      this.trafficDataModel.getFilteredAndSortedData(
        startDate,
        endDate,
        sortOrder
      );
    const { views, visitors } = this.trafficDataModel.calculateTotalTraffic(
      filteredAndSortedData
    );

    this.resultView.updateFilteredView(filteredAndSortedData, views, visitors);
  }
}
