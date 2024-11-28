export interface View {
  count: number;
  uniques: number;
  timestamp: string;
}

export type TrafficData = View[];

export interface ResponseTrafficData {
  count: number;
  uniques: number;
  views: View[];
}
