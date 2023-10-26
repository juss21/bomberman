import { createElement, append } from "../../dist/framework.js";
import { startWebSocketConnction } from "./websocket.js";

const app = document.getElementById("app");

export function CreateHtmlLayout() {
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

    // create lives counter
    const livesCounter = createElement("div", {
      id: "lives",
      innerHTML: "Lives 3",
    });
    append(overlay, livesCounter);
  }
}

export function StartGame() {
  console.log("game started.");
  // connecting with the websocket and starting the game loop
  startWebSocketConnction();
}
