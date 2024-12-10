chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("cleanupOldData", { periodInMinutes: 1440 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "cleanupOldData") {
    cleanUpOldData();
  }
});

function loadSpecificKeyData(key) {
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

function getAllKeys() {
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

async function cleanUpOldData() {
  const allKeys = await getAllKeys();
  const now = Date.now();
  const twoYearAgo = now - 365 * 24 * 60 * 60 * 1000 * 2;

  const keysToDelete = [];

  for (const key of allKeys) {
    const data = await loadSpecificKeyData(key);
    if (data.date && new Date(data.date).getTime() < twoYearAgo) {
      keysToDelete.push(key);
    }
  }

  if (keysToDelete.length > 0) {
    chrome.storage.local.remove(keysToDelete, () => {
      if (chrome.runtime.lastError) {
        console.error("Failed to delete old data:", chrome.runtime.lastError);
      } else {
        console.log("Deleted old data:", keysToDelete);
      }
    });
  }

    const repoList = await new Promise((resolve, reject) => {
      chrome.storage.local.get("repoList", (result) => {
        if (chrome.runtime.lastError) {
          reject(
            new Error(
              `Failed to load repo list: ${chrome.runtime.lastError.message}`
            )
          );
        } else {
          resolve(result.repoList || []);
        }
      });
    });
  
    const updatedRepoList = repoList.filter((repo) => {
      const relatedKeys = allKeys.filter((key) =>
        key.startsWith(`trafficData_${repo.repoName}_`)
      );
      const hasRemainingData = relatedKeys.some(
        (key) => !keysToDelete.includes(key)
      );
  
      if (!hasRemainingData) {
        console.log(`Removed ${repo.repoName} from repoList as it has no data.`);
      }
  
      return hasRemainingData;
    });
  
    chrome.storage.local.set({ repoList: updatedRepoList }, () => {
      if (chrome.runtime.lastError) {
        console.error("Failed to update repoList:", chrome.runtime.lastError);
      } else {
        console.log("Updated repoList:", updatedRepoList);
      }
    });
}
