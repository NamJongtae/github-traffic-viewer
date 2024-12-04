import { TrafficData, View } from "../types/trafficDataTypes";

export class LocalStorageModel {
  private readonly LOCAL_STORAGE_KEY_PREFIX = "trafficData_";

  // 날짜별로 데이터 저장
  saveToLocalStorage(repoName: string, date: string, data: View) {
    const key = this.getStorageKey(repoName, date);
    chrome.storage.local.set({ [key]: data }, () =>
      console.log(`Data saved for ${repoName} on ${date}`)
    );
  }

  // 날짜별로 데이터 불러오기
  loadFromLocalStorage(repoName: string, date: string): Promise<TrafficData[]> {
    const key = this.getStorageKey(repoName, date);

    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (result) => {
        if (chrome.runtime.lastError) {
          reject(
            new Error(
              `Failed to load data for ${repoName} on ${date}: ${chrome.runtime.lastError.message}`
            )
          );
        } else {
          const storedData = result[key] || [];
          resolve(storedData);
        }
      });
    });
  }

  // 전체 데이터를 불러와서 병합
  async mergeDataWithLocalStorage(
    repoName: string,
    newData: TrafficData[]
  ): Promise<TrafficData[]> {
    const allData = await this.loadAllDataFromLocalStorage(repoName);
    const mergedData = [...allData]; // 기존 전체 데이터

    // 새 데이터를 병합
    newData.forEach((newItem) => {
      const index = mergedData.findIndex((item) => item.date === newItem.date);
      if (index > -1) {
        mergedData[index] = newItem; // 중복된 항목 업데이트
      } else {
        mergedData.push(newItem); // 새로운 항목 추가
      }
    });

    // 병합된 데이터를 반환
    return mergedData;
  }

  // repoName에 해당하는 모든 날짜의 데이터를 불러오기
  async loadAllDataFromLocalStorage(repoName: string): Promise<TrafficData[]> {
    const allKeys = await this.getAllKeys();
    const relevantKeys = allKeys.filter((key) =>
      key.startsWith(`${this.LOCAL_STORAGE_KEY_PREFIX}${repoName}_`)
    );

    const dataPromises = relevantKeys.map((key) =>
      this.loadSpecificKeyData(key)
    );
    const allData = await Promise.all(dataPromises);

    return allData.flat(); // 병합된 데이터 반환
  }

  // 키로 특정 데이터 로드
  private loadSpecificKeyData(key: string): Promise<TrafficData[]> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (result) => {
        if (chrome.runtime.lastError) {
          reject(
            new Error(
              `Failed to load data for key ${key}: ${chrome.runtime.lastError.message}`
            )
          );
        } else {
          const storedData = result[key] || [];
          resolve(storedData);
        }
      });
    });
  }

  // 모든 로컬스토리지 키 불러오기
  private getAllKeys(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(null, (result) => {
        if (chrome.runtime.lastError) {
          reject(
            new Error(
              `Failed to get all keys: ${chrome.runtime.lastError.message}`
            )
          );
        } else {
          resolve(Object.keys(result));
        }
      });
    });
  }

  // 키 생성 (repoName + date)
  private getStorageKey(repoName: string, date: string): string {
    return `${this.LOCAL_STORAGE_KEY_PREFIX}${repoName}_${date}`;
  }
}
