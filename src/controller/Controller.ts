import { $ } from "../utils";
import { View } from "../view/View";

export class Controller {
  constructor(private view: View) {
    this.view.init(()=>this.bindMainMenuEvents());
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
    // 버튼 클릭 시 get-traffic-form 렌더링
  }

  private handleClickLoadTraffic() {
    // 버튼 클릭 시 load-traffic-form 렌더링
  }

  private handleClickDocsBtn() {
    window.open(
      "https://github.com/NamJongtae/github-traffic-viewer",
      "Docs",
      "width=1000px,height=1000px,scrollbars=yes"
    );
  }
}
