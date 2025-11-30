import Konva from "konva";
import { MoneyController } from "./MoneyController.ts";

const stage = new Konva.Stage({
  container: "container",
  width: window.innerWidth,
  height: window.innerHeight,
});

// then create layer
let layer = new Konva.Layer();
//stage.add(layer);

// create our shape
const circle = new Konva.Circle({
  x: stage.width() / 2,
  y: stage.height() / 2,
  radius: 70,
  fill: "red",
  stroke: "black",
  strokeWidth: 4,
});

console.log("Main Monet");

let controller = new MoneyController();

layer.add(controller.getGroup());

// add the layer to the stage
stage.add(layer);
