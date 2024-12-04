export interface TrafficData {
  date: string;
  views: number;
  unique_vistior: number;
}

export interface View {
  count: number;
  uniques: number;
  timestamp: string;
}

export interface ResponseTrafficData {
  count: number;
  uniques: number;
  views: View[];
}
