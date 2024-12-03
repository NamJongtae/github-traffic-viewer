import { TrafficDataModel } from "../model/TrafficDataModel";
import { TrafficData } from "../types/trafficDataTypes";
import { $, downloadExcel, downloadJson, validateDates } from "../utils";
import { ResultView } from "../view/ResultView";

export class ResultController {
  constructor(
    private trafficDataModel: TrafficDataModel,
    private resultView: ResultView
  ) {}

  renderResult(data: TrafficData) {
    this.resultView.removeElement(".error-msg");
    this.resultView.renderResult(data, () => this.bindResultEvents());
    const { views, visitors } =
      this.trafficDataModel.calculateTotalTraffic(data);

    this.resultView.updateTrafficSummary(views, visitors);
  }

  bindResultEvents() {
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

    const downloadJsonBtn = $(".download-json-btn") as HTMLButtonElement;
    this.resultView.bindEvent(downloadJsonBtn, "click", () => {
      const startDate = startDateInput.value;
      const endDate = endDateInput.value;

      const data = this.trafficDataModel.filterDataByDate(startDate, endDate);
      downloadJson(data);
    });

    const downloadExcelBtn = $(".download-excel-btn") as HTMLButtonElement;
    this.resultView.bindEvent(downloadExcelBtn, "click", () => {
      const startDate = startDateInput.value;
      const endDate = endDateInput.value;

      const data = this.trafficDataModel.filterDataByDate(startDate, endDate);
      downloadExcel(data);
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
