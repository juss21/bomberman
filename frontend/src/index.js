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
import { gameMenu } from "./game/createHtml.js";
import { preload } from "./preload.js";

loadCSS("./src/index.css");
preload();

localStorage.clear(); // clear localStorage

const app = document.getElementById("app");
export const backendHost = `localhost:8081`;

export let frameCapping = 0;
export const setFrameCapping = (value) => {
  frameCapping = value;
};

function render() {
  gameMenu(app); // return a game menu
}

// Initial rendering
/* ROUTING */
const routes = {
  "/": () => {
    render();
  },
};

new Router(routes);
