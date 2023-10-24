import { drawTiles } from "./board.js";
import { createElement, append, addEventListenerToElement } from "../../dist/framework.js";
import { movePlayer, stopAnimation } from "./physics.js";

const app = document.getElementById("app");

function CreateHtmlLayout() {
  if (!document.getElementById("game")) {
    const gameArena = createElement("div", { class: "playArea", id: "game" });
    append(app, gameArena);
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
}

export function StartGame() {
  console.log("game started.");
  CreateHtmlLayout();
  drawTiles();
  // start game loop...
}

addEventListenerToElement(window ,"keydown", movePlayer);
addEventListenerToElement(window, "keyup", stopAnimation);
