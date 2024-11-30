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
  }

  return message;
}

// 날짜 형식 포맷팅
export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

// 날짜 필터 유효성 체크
export function validateDates(startDate: string, endDate: string) {
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return false;
  }
  return true;
}

export function downloadJson(data: TrafficData) {
  if (!data || data.length === 0) {
    alert("The data to download does not exist.");
    return;
  }

  const transformData = data.map((item) => ({
    Date: item.timestamp,
    Views: item.count,
    "Unique visitors": item.uniques,
  }));

  const blob = new Blob([JSON.stringify(transformData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `trafficData.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadExcel(data: TrafficData) {
  if (!data || data.length === 0) {
    alert("The data to download does not exist.");
    return;
  }

  const transformData = data.map((item) => ({
    Date: item.timestamp,
    Views: item.count,
    "Unique visitors": item.uniques,
  }));

  const worksheet = XLSX.utils.json_to_sheet(transformData);
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
