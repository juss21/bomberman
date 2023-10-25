import { drawTiles } from "./board.js";
import { createElement, append } from "../../dist/framework.js";
import { startWebSocketConnction } from "./websocket.js";

const app = document.getElementById("app");

function CreateHtmlLayout() {
  if (!document.getElementById("")) {
    const game = createElement("div", {
      class: "playground",
      id: "playground",
    });
    append(app, game);
  }
  const playground = document.getElementById("playground");

  if (!document.getElementById("game")) {
    const gameArena = createElement("div", { class: "playArea", id: "game" });
    append(playground, gameArena);
  }

  const gameArea = document.getElementById("game");

  if (!document.getElementById("tileMap")) {
    const tileMap = createElement("div", { class: "tileMap", id: "tileMap" });
    append(gameArea, tileMap);
  }

  if (!document.getElementById("players")) {
    const playersDiv = createElement("div", { id: "players" });
    append(gameArea, playersDiv);
  }

  if (!document.getElementById("overlay")) {
    const overlay = createElement("div", { id: "overlay" });
    append(playground, overlay);

    // create fps counter
    const fpsCounter = createElement("div", { id: "fps" });
    append(overlay, fpsCounter);
  }
}

export function StartGame() {
  console.log("game started.");
  CreateHtmlLayout();
  drawTiles();

  // connecting with the websocket and starting the game loop
  startWebSocketConnction();
}
