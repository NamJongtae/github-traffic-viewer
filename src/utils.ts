import { TrafficData } from "./types/trafficDataTypes";
import * as XLSX from "xlsx";

// DOM element selector
export function $(selector: string) {
  const rootEl = document.querySelector("#app") as HTMLDivElement;
  return rootEl.querySelector(selector);
}

// 에러 메시지 생성
export function generateFormErrorMsg(error: Error) {
  let message = "Something went wrong. Please try again later.";
  if (error.message.includes("401")) {
    message = "Please check your Access Token.";
  } else if (error.message.includes("404")) {
    message = "Please check your GitHub username or repository name.";
  } else if (error.message.includes("maximum")) {
    message =
      "The maximum repository storage limit has been exceeded. (Maximum: 10)\nPlease delete stored data and try again.";
  }

  return message;
}

// 날짜 형식 포맷팅
export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour =
    date.getHours() < 10
      ? String(date.getHours()).padStart(2, "0")
      : String(date.getHours());
  const minutes =
    date.getMinutes() < 10
      ? String(date.getMinutes()).padStart(2, "0")
      : String(date.getMinutes());

  return `${year}.${month}.${day} ${hour}:${minutes}`;
}

// 날짜 필터 유효성 체크
export function validateDates(startDate: string, endDate: string) {
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return false;
  }
  return true;
}

export function downloadJson(data: TrafficData[]) {
  if (!data || data.length === 0) {
    alert("The data to download does not exist.");
    return;
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `trafficData.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadExcel(data: TrafficData[]) {
  if (!data || data.length === 0) {
    alert("The data to download does not exist.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Traffic Data");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `trafficData.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadTxt(data: TrafficData[]) {
  if (!data || data.length === 0) {
    alert("The data to download does not exist.");
    return;
  }

  const textContent = data
    .map((item) => JSON.stringify(item, null, 2))
    .join("\n\n");

  const blob = new Blob([textContent], {
    type: "text/plain",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `trafficData.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function readJsonFile(file: File): Promise<TrafficData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(
          e.target?.result as string
        ) as TrafficData[];
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export async function readExcelFile(file: File): Promise<TrafficData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const jsonData = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheetName]
        ) as TrafficData[];
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export async function readTxtFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;

        const blocks = content
          .split("\n")
          .map((line) => line.trim()) // 공백 제거
          .filter((line) => line !== ""); // 빈 줄 제거

        let currentObject = ""; // 현재 JSON 블록 저장
        const jsonData = [];

        for (const line of blocks) {
          currentObject += line;

          try {
            // 객체가 완전하면 즉시 파싱
            const parsedObject = JSON.parse(currentObject);
            jsonData.push(parsedObject);
            currentObject = ""; // 초기화
          } catch (err) {
            // JSON 파싱 실패: 아직 완성되지 않은 JSON 블록일 가능성
            if (!line.endsWith("}")) {
              continue; // 블록 계속 누적
            }
            // 잘못된 JSON 구조
            throw new Error(`Invalid JSON format in block: ${currentObject}`);
          }
        }

        resolve(jsonData);
      } catch (error) {
        reject(
          new Error(
            "Failed to parse the text file. Ensure it has valid JSON objects."
          )
        );
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

