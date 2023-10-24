import {
  createElement,
  append,
  State,
  loadCSS,
  event,
  addEventListener,
  Router,
  addEventListenerToElement,
} from "../dist/framework.js";
import { StartGame } from "./game/game.js";
import { buildMaps } from "./game/maps/mapBuilder.js";

loadCSS("./src/index.css");

const app = document.getElementById("app");

function render() {
  console.log("building maps");
  buildMaps();

  const application = createElement("h1", { innerHTML: "test" });
  append(app, application);

  let button = createElement("button", { innerHTML: "click me" });

  append(app, button);

  addEventListenerToElement(button, "click", () => {
    console.log("game started!");
    StartGame();
  });
}

// Initial rendering
/* ROUTING */
const routes = {
  "/": () => {
    render();
  },
};

const routerInstance = new Router(routes);

// Listen for changes in the todoState and re-render when the state changes
