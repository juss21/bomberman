import { drawTiles } from "./board.js";
import { createElement, append } from "../../dist/framework.js";

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


function movePlayer(event) {
  const player = document.getElementById("Player-1");
  const speed = 5; // Adjust the speed as needed
  let left = parseInt(player.style.left);
  let bottom = parseInt(player.style.bottom);

  if (event.key === "W" || event.key === "w") {
    bottom += speed;
  }
  if (event.key === "A" || event.key === "a") {
    left -= speed;
  }
  if (event.key === "S" || event.key === "s") {
    bottom -= speed;
  }
  if (event.key === "D" || event.key === "d") {
    left += speed;
  }
  player.style.left = left + "px";
  player.style.bottom = bottom + "px";
}

window.addEventListener("keydown", movePlayer);
window.addEventListener("keyup", movePlayer);

export function StartGame() {
  console.log("game started.");
  CreateHtmlLayout();
  drawTiles();
  // start game loop...
}
