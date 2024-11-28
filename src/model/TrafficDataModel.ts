import { ResponseTrafficData, TrafficData } from '../types/trafficDataTypes';

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
}
