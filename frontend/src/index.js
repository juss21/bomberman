import {
  createElement,
  append,
  State,
  loadCSS,
  Event,
  addEventListener,
  Router,
  addEventListenerToElement,
} from "../dist/framework.js";
import { StartGame } from "./game/game.js";

loadCSS("./src/index.css");

const app = document.getElementById("app");
export const backendHost = `localhost:8081`;

export let frameCapping = 0;
export const setFrameCapping = (value) => {
  frameCapping = value;
};

function render() {
  // console.log("building maps");
  // buildMaps();

  const application = createElement("h1", { innerHTML: "test" });
  append(app, application);

  let button = createElement("button", { innerHTML: "click me" });

  append(app, button);

  addEventListenerToElement(button, "click", () => {
    console.log("game started!");
    StartGame();
    button.disabled = true;
    append(app, button);
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
