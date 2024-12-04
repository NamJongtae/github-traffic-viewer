import {
  FormControllerEvents,
  MainMenuControllerEvents,
  ResultControllerEvents,
} from "./controllerEventsTypes";

export type EventMap = MainMenuControllerEvents &
  FormControllerEvents &
  ResultControllerEvents;
