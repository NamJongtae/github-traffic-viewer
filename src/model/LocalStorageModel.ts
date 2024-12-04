import { TrafficData } from "../types/trafficDataTypes";

export class LocalStorageModel {
  private readonly LOCAL_STORAGE_KEY_PREFIX = "trafficData_";
  private readonly REPO_LIST_KEY = "repoList";

  // 레포지토리 이름 관리
  private async addRepoToList(repoName: string): Promise<void> {
    const repoList = await this.getRepoList();
    const isExist = repoList.some((data) => data.repoName === repoName);
    if (!isExist) {
      if (repoList.length >= 10) {
        throw new Error(
          "The maximum repository storage limit has been exceeded."
        );
      }
      const now = new Date().toISOString();
      const data = { lastUpdated: now, repoName };
      repoList.push(data);
      chrome.storage.local.set({ [this.REPO_LIST_KEY]: repoList });
    }
  }

  private async removeRepoFromList(repoName: string): Promise<void> {
    const repoList = await this.getRepoList();
    const updatedRepoList = repoList.filter(
      (data) => data.repoName !== repoName
    );
    chrome.storage.local.set({ [this.REPO_LIST_KEY]: updatedRepoList });
  }

  async getRepoList(): Promise<{ lastUpdated: string; repoName: string }[]> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(this.REPO_LIST_KEY, (result) => {
        if (chrome.runtime.lastError) {
          reject(
            new Error(
              `Failed to load repository list: ${chrome.runtime.lastError.message}`
            )
          );
        } else {
          resolve(result[this.REPO_LIST_KEY] || []);
        }
      });
    });
  }

  // 날짜별로 데이터 저장
  async saveToLocalStorage(repoName: string, date: string, data: TrafficData) {
    const key = this.getStorageKey(repoName, date);
    try {
      await this.addRepoToList(repoName); // 저장할 때 레포 이름 추가
    } catch (error) {
      throw error;
    }
    chrome.storage.local.set({ [key]: data }, () => {
      console.log(`Data saved for ${repoName} on ${date}`);
    });
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
  loadSpecificKeyData(key: string): Promise<TrafficData> {
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
  getAllKeys(): Promise<string[]> {
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

  // 레포지토리 데이터 삭제
  async deleteAllDataForRepo(repoName: string): Promise<void> {
    const allKeys = await this.getAllKeys();
    const keysToDelete = allKeys.filter((key) =>
      key.startsWith(`${this.LOCAL_STORAGE_KEY_PREFIX}${repoName}_`)
    );

    if (keysToDelete.length === 0) {
      throw new Error(
        "The saved traffic data for this repository does not exist."
      );
    }

    return new Promise((resolve, reject) => {
      chrome.storage.local.remove(keysToDelete, async () => {
        if (chrome.runtime.lastError) {
          reject(
            new Error(
              `Failed to delete data for ${repoName}: ${chrome.runtime.lastError.message}`
            )
          );
        } else {
          await this.removeRepoFromList(repoName); // 삭제 시 레포 이름 제거
          alert(`All data for ${repoName} has been deleted.`);
          resolve();
        }
      });
    });
  }

  // 키 생성 (repoName + date)
  private getStorageKey(repoName: string, date: string): string {
    return `${this.LOCAL_STORAGE_KEY_PREFIX}${repoName}_${date}`;
  }
}
