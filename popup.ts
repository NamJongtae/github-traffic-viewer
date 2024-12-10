import "./src/styles/globals.css";
import "./src/styles/mainMenu.css";
import "./src/styles/form.css";
import "./src/styles/result.css";
import { FormController } from "./src/controller/FormController";
import { MainMenuController } from "./src/controller/MainMenuController";
import { ResultController } from "./src/controller/ResultController";
import { EventBus } from "./src/EventBus";
import { LocalStorageModel } from "./src/model/LocalStorageModel";
import { TrafficDataModel } from "./src/model/TrafficDataModel";
import { FormView } from "./src/view/FormView";
import { MainMenuView } from "./src/view/MainMenuView";
import { ResultView } from "./src/view/ResultView";


// Model Instance
const trafficDataModel = new TrafficDataModel();
const localStorageModel = new LocalStorageModel();

// View Instance
const mainMenuView = new MainMenuView();
const formView = new FormView();
const resultView = new ResultView();

const eventBus = new EventBus();

// Controller Instance
new MainMenuController(mainMenuView, eventBus);
new FormController(trafficDataModel, localStorageModel, formView, eventBus);
new ResultController(trafficDataModel, resultView, eventBus);
