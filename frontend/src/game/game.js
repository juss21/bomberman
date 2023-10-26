import { drawTiles } from "./board.js";
import { createElement, append } from "../../dist/framework.js";
import { startWebSocketConnction } from "./websocket.js";
import { gameState } from "./gameState.js";

const app = document.getElementById("app");

export function loseLife(playerId) {
  if (!gameState.players[playerId].Invincible) {
    gameState.players[playerId].Lives -= 1;
    gameState.players[playerId].Invincible = true;
    let player = document.getElementById(`Player-${playerId + 1}`);
    let livesCounter = document.getElementById("lives");
    livesCounter.innerHTML = "Lives: " + gameState.players[playerId].Lives;
    player.style.opacity = 0.5;
    const explosionDuration = 2000;
    setTimeout(() => {
      gameState.players[playerId].Invincible = false;
      player.style.opacity = 1;
    }, explosionDuration);
  }
  if (gameState.players[playerId].Lives <= 0) {
    let players = document.getElementById("players");
    let player = document.getElementById(`Player-${playerId + 1}`);
    if (player) players.removeChild(player);
  }
}
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
    const livesCounter = createElement("div", { id: "lives" });
    livesCounter.innerHTML = "Lives: " + gameState.players[playerId].Lives;
    append(overlay, livesCounter);
  }
}

export function StartGame() {
  console.log("game started.");
  CreateHtmlLayout();
  // drawTiles();

  // connecting with the websocket and starting the game loop
  startWebSocketConnction();
}
