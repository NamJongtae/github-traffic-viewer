import "./src/styles.css";
import { View } from "./src/view/View";
import { Controller } from "./src/controller/Controller";
import { TrafficDataModel } from "./src/model/TrafficDataModel";
import { LocalStorageModel } from "./src/model/LocalStorageModel";

const trafficDataModel = new TrafficDataModel();
const localStorageModel = new LocalStorageModel();

const view = new View();
new Controller(trafficDataModel, localStorageModel, view);
