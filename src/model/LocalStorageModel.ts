import { TrafficData } from '../types/trafficDataTypes';


export class LocalStorageModel {
  private readonly LOCAL_STORAGE_KEY_PREFIX = "trafficData_";

  saveToLocalStorage(repoName: string, data: TrafficData) {
    chrome.storage.local.set(
      { [this.LOCAL_STORAGE_KEY_PREFIX + repoName]: data },
      () => console.log(`Data saved for ${repoName}`)
    );
  }

  loadFromLocalStorage(repoName: string): Promise<TrafficData> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(
        this.LOCAL_STORAGE_KEY_PREFIX + repoName,
        (result) => {
          if (chrome.runtime.lastError) {
            reject(
              new Error(
                `Failed to load data for ${repoName}: ${chrome.runtime.lastError.message}`
              )
            );
          } else {
            const storedData =
              result[this.LOCAL_STORAGE_KEY_PREFIX + repoName] || [];
            resolve(storedData);
          }
        }
      );
    });
  }

  async mergeDataWithLocalStorage(
    repoName: string,
    newData: TrafficData
  ): Promise<TrafficData> {
    const storedData = await this.loadFromLocalStorage(repoName);
    const mergedData = storedData ? [...storedData] : [];

    newData.forEach((newItem) => {
      const index = mergedData.findIndex(
        (item) => item.timestamp === newItem.timestamp
      );
      if (index > -1) {
        mergedData[index] = newItem;
      } else {
        mergedData.push(newItem);
      }
    });

    // 병합된 데이터를 반환
    return mergedData;
  }
}
