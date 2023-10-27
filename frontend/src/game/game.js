import { createElement, append } from "../../dist/framework.js";
import { startWebSocketConnction } from "./websocket.js";

const app = document.getElementById("app");

export function CreateHtmlLayout() {
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

export function StartGame(offline, playerName = "Player1") {
  console.log("game started.");

  if (offline) {
    // offline (endless gamemode) play, must fetch map from backend!
  } else {
    localStorage.setItem("PlayerName", playerName);
    // connecting with the websocket and starting the game loop
    startWebSocketConnction();
  }
}
