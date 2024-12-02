import { LocalStorageModel } from "../model/LocalStorageModel";
import { TrafficDataModel } from "../model/TrafficDataModel";
import {
  $,
  downloadExcel,
  downloadJson,
  generateFormErrorMsg,
  validateDates,
} from "../utils";
import { View } from "../view/View";

export class Controller {
  constructor(
    private trafficDataModel: TrafficDataModel,
    private localStorageModel: LocalStorageModel,
    private view: View
  ) {
    this.view.init(() => this.bindMainMenuEvents());
  }

  bindMainMenuEvents() {
    const getTrafficBtn = $(".get-traffic-btn") as HTMLButtonElement;
    this.view.bindEvent(getTrafficBtn, "click", () =>
      this.handleClickGetTraffic()
    );

    const loadTrafficBtn = $(".load-traffic-btn") as HTMLButtonElement;
    this.view.bindEvent(loadTrafficBtn, "click", () =>
      this.handleClickLoadTraffic()
    );

    const goToDocsBtn = $(".docs-btn") as HTMLButtonElement;
    this.view.bindEvent(goToDocsBtn, "click", () => {
      this.handleClickDocsBtn();
    });
  }

  private handleClickGetTraffic() {
    this.view.renderGetTrafficForm(() => this.bindGetTrafficFormEvents());
  }

  private handleClickLoadTraffic() {
    this.view.renderLoadTrafficForm(() => this.bindLoadTrafficFormEvents());
  }

  private handleClickDocsBtn() {
    window.open(
      "https://github.com/NamJongtae/github-traffic-viewer",
      "Docs",
      "width=1000px,height=1000px,scrollbars=yes"
    );
  }

  bindGetTrafficFormEvents() {
    const form = $(".get-traffic-form") as HTMLFormElement;
    this.view.bindEvent(form, "submit", (e) => this.handleSubmitTrafficForm(e));

    const inputs = document.querySelectorAll(
      ".input-group input"
    ) as NodeListOf<HTMLInputElement>;
    this.view.bindEvents(inputs, "input", (event) => {
      const input = event.target as HTMLInputElement;
      const clearBtn = input.nextElementSibling as HTMLButtonElement;
      this.toggleClearButton(input, backBtn);
      if (clearBtn && input instanceof HTMLInputElement) {
        this.bindInputClearEvents(input, clearBtn);
      }
    });

    inputs.forEach((input) => {
      const clearBtn = input.nextElementSibling as HTMLButtonElement;
      this.toggleClearButton(input, clearBtn);
    });

    const backBtn = $(".back-btn") as HTMLButtonElement;
    this.view.bindEvent(backBtn, "click", () => this.handleClickBackButton());
  }

  private async handleSubmitTrafficForm(event: Event) {
    event.preventDefault();

    const githubId = ($("#github-username") as HTMLInputElement).value;
    const githubToken = ($("#github-token") as HTMLInputElement).value;
    const repoName = ($("#repo-name") as HTMLInputElement).value;

    this.view.removeErrorMsg();
    this.view.activeFormLoading();

    try {
      const responseData = await this.trafficDataModel.fetchTrafficData(
        githubId,
        repoName,
        githubToken
      );

      // 로컬 스토리지와 병합
      const mergedData = await this.localStorageModel.mergeDataWithLocalStorage(
        repoName,
        responseData.views
      );

      this.trafficDataModel.setTrafficData(mergedData);

      for (const view of responseData.views) {
        this.localStorageModel.saveToLocalStorage(
          repoName,
          view.timestamp,
          view
        ); // 날짜별 데이터 저장
      }

      // Result  element 렌더링
      this.view.renderResult(mergedData, () => this.bindResultEvents());
      const { views, visitors } =
        this.trafficDataModel.calculateTotalTraffic(mergedData);
      this.view.updateTrafficSummary(views, visitors);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const message = generateFormErrorMsg(error);
        this.view.renderErrorMsg(".back-btn", message);
      }
    } finally {
      this.view.inactiveFormLoading();
    }
  }

  private toggleClearButton(
    input: HTMLInputElement,
    button: HTMLButtonElement
  ) {
    button.style.display = input.value ? "block" : "none";
  }

  private bindInputClearEvents(
    input: HTMLInputElement,
    clearBtn: HTMLButtonElement
  ) {
    // 초기 버튼 상태 토글
    this.toggleClearButton(input, clearBtn);

    this.view.bindEvent(input, "input", () =>
      this.toggleClearButton(input, clearBtn)
    );

    this.view.bindEvent(clearBtn, "click", () => {
      input.value = "";
      this.toggleClearButton(input, clearBtn);
    });
  }

  private handleClickBackButton() {
    this.view.removeElement(".get-traffic-form");
    this.view.removeElement(".load-traffic-form");
    this.view.removeElement(".result");
    this.view.renderMainMenu(() => this.bindMainMenuEvents());
  }

  bindLoadTrafficFormEvents() {
    const form = $(".load-traffic-form") as HTMLFormElement;
    this.view.bindEvent(form, "submit", this.handleSubmitLoadForm.bind(this));

    const input = $(".input-group input") as HTMLInputElement;
    const clearBtn = input.nextElementSibling as HTMLButtonElement;
    this.toggleClearButton(input, clearBtn);

    this.view.bindEvent(input, "input", () => {
      this.bindInputClearEvents(input, clearBtn);
    });

    const backBtn = $(".back-btn") as HTMLButtonElement;
    this.view.bindEvent(
      backBtn,
      "click",
      this.handleClickBackButton.bind(this)
    );
  }

  private async handleSubmitLoadForm(event: Event) {
    event.preventDefault();

    const repoName = ($("#repo-name") as HTMLInputElement).value;
    const data = await this.localStorageModel.loadAllDataFromLocalStorage(repoName);

    this.view.removeErrorMsg();

    if (data.length === 0) {
      this.view.renderErrorMsg(
        ".back-btn",
        "The saved traffic data for this repository does not exist."
      );
      return;
    }

    // 전역 데이터에 불러온 데이터 저장
    this.trafficDataModel.setTrafficData(data);

    // 결과 렌더링
    this.view.renderResult(data, () => this.bindResultEvents());

    const { views, visitors } =
      this.trafficDataModel.calculateTotalTraffic(data);
    this.view.updateTrafficSummary(views, visitors);
  }

  bindResultEvents() {
    const startDateInput = $("#start-date") as HTMLInputElement;
    this.view.bindEvent(startDateInput, "input", () =>
      this.handleFilterChange()
    );

    const endDateInput = $("#end-date") as HTMLInputElement;
    this.view.bindEvent(endDateInput, "input", () => this.handleFilterChange());
    const today = new Date().toISOString().split("T")[0];
    endDateInput.setAttribute("max", today);

    const sortOrderSelect = $("#sort-order") as HTMLSelectElement;
    this.view.bindEvent(sortOrderSelect, "input", () =>
      this.handleFilterChange()
    );

    const data = this.trafficDataModel.getTrafficData();
    const downloadJsonBtn = $(".download-json-btn") as HTMLButtonElement;
    this.view.bindEvent(downloadJsonBtn, "click", () => downloadJson(data));

    const downloadExcelBtn = $(".download-excel-btn") as HTMLButtonElement;
    this.view.bindEvent(downloadExcelBtn, "click", () => downloadExcel(data));
  }

  private handleFilterChange() {
    const startDate = ($("#start-date") as HTMLInputElement).value;
    const endDate = ($("#end-date") as HTMLInputElement).value;
    const sortOrder = ($("#sort-order") as HTMLSelectElement).value;

    this.view.removeErrorMsg("filter");
    this.view.removeNoDataMessage();

    const isValidDate = validateDates(startDate, endDate);

    if (!isValidDate) {
      this.view.renderErrorMsg(
        ".filters",
        "Start Date cannot be later than End Date.",
        "filter"
      );
      this.view.clearTrafficSummary();
      this.view.removeTrafficTable();
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

    this.view.updateFilteredView(filteredAndSortedData, views, visitors);
  }
}
