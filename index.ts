import "./src/styles.css";
import { FormController } from "./src/controller/FormController";
import { MainMenuController } from "./src/controller/MainMenuController";
import { ResultController } from "./src/controller/ResultController";
import { LocalStorageModel } from "./src/model/LocalStorageModel";
import { TrafficDataModel } from "./src/model/TrafficDataModel";
import { FormView } from "./src/view/FormView";
import { MainMenuView } from "./src/view/MainMenuView";
import { ResultView } from "./src/view/ResultView";

// View Instance
const mainMenuView = new MainMenuView();
const formView = new FormView();
const resultView = new ResultView();

// Model Instance
const trafficDataModel = new TrafficDataModel();
const localStorageModel = new LocalStorageModel();

// Controller Instance
const resultController = new ResultController(trafficDataModel, resultView);
const mainMenuController = new MainMenuController(mainMenuView);
const formController = new FormController(
  trafficDataModel,
  localStorageModel,
  formView,
  resultController
);

// To resolve circular dependencies.
mainMenuController.setDependency(formController);
formController.setDependency(mainMenuController);
