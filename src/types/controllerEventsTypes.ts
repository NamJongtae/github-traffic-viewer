import { TrafficData } from "./trafficDataTypes";

export type MainMenuControllerEvents = {
  initializeMainMenu: () => void;
};

export type FormControllerEvents = {
  initializeGetTrafficForm: () => void;
  initializeLoadTrafficForm: () => void;
};

export type ResultControllerEvents = {
  initializeResult: (data: TrafficData[], repoName: string) => void;
};
