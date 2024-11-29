import { ResponseTrafficData, TrafficData } from "../types/trafficDataTypes";

export class TrafficDataModel {
  data: TrafficData;
  constructor() {
    this.data = {} as TrafficData;
  }

  setTrafficData(newData: TrafficData) {
    this.data = newData;
  }

  getTrafficData() {
    return this.data;
  }

  async fetchTrafficData(
    githubId: string,
    repoName: string,
    token: string
  ): Promise<ResponseTrafficData> {
    const response = await fetch(
      `https://api.github.com/repos/${githubId}/${repoName}/traffic/views`,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return (await response.json()) as ResponseTrafficData;
  }

  filterDataByDate(startDate: string, endDate: string) {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return this.data.filter((item) => {
      const itemDate = new Date(item.timestamp);
      return (!start || itemDate >= start) && (!end || itemDate <= end);
    });
  }

  sortData(filteredData: TrafficData, sortOrder: string) {
    const sortedData = filteredData.sort((a, b) => {
      if (sortOrder === "views") {
        // views 필드 기준 정렬
        return b.count - a.count;
      } else if (sortOrder === "visitors") {
        // uniques 필드 기준 정렬
        return b.uniques - a.uniques;
      } else {
        // 기본 날짜 정렬
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
    });
    return sortedData;
  }

  getFilteredAndSortedData(
    startDate: string,
    endDate: string,
    sortOrder: string
  ): TrafficData {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // 데이터 필터링
    const filteredData = this.data.filter((item) => {
      const itemDate = new Date(item.timestamp);
      return (!start || itemDate >= start) && (!end || itemDate <= end);
    });

    // 데이터 정렬
    const sortedData = this.sortData(filteredData, sortOrder);
    return sortedData;
  }

  calculateTotalTraffic(data: TrafficData) {
    const views = data.reduce((sum, item) => sum + item.count, 0);
    const visitors = data.reduce((sum, item) => sum + item.uniques, 0);
    return { views, visitors };
  }
}
