import { removeAllEventListeners } from "../../dist/framework.js";
import { setFrameCapping } from "../index.js";
import { toggleMenuHide } from "./createHtml.js";
import { gameState } from "./gameState.js";

export let refreshRate = 60;
// this function handles the framerate, displaying it in game
export function frameRate(frameTimes) {
  const now = performance.now(); // current performance
  while (frameTimes.length > 0 && frameTimes[0] <= now - 1000) {
    frameTimes.shift();
  }
  frameTimes.push(now);
  let fps =
    frameTimes.length > 30
      ? frameTimes.length.toString()
      : frameTimes.length.toString();
  /* if (fps > 62) {
    console.log(
      fps,
      "Your refresh rate is too high, your frame rate is capped for this session!"
    );
    setFrameCapping(1000 / 72);
  }*/
  if (parseInt(fps) > 60) refreshRate = parseInt(fps) - 1;
  document.getElementById("fps").innerHTML = "FPS: " + fps;
}

export function YourName() {
  const localPlayer = parseInt(localStorage.getItem("Player"));

  const element = document.getElementById("your_name");
  element.innerHTML = localStorage.getItem("PlayerName");
  element.className = `playerId-${localPlayer}`;
}

export function PlayingAs() {
  const localPlayer = parseInt(localStorage.getItem("Player"));

  const element = document.getElementById("playing_as");
  element.innerHTML = `Player-${localPlayer}`;
  element.className = `playerId-${localPlayer}`;
}

export function Lives() {
  const localPlayer = parseInt(localStorage.getItem("Player"));

  const element = document.getElementById("lives");
  element.innerHTML = `Lives: ${gameState.players[localPlayer - 1].Lives}`;
  element.className = `playerId-${localPlayer}`;

  if (gameState.players[localPlayer - 1].Lives === 0) {
    toggleMenuHide();
    document.getElementById("lobbyCountDown").innerHTML =
      "You died! Better luck next time!";
  }
}

export function updatePlayerLifeCounter(playerId) {
  console.log("updating player lives:", playerId);
  const localPlayer = parseInt(localStorage.getItem("Player"));
  if (playerId === localPlayer) {
    Lives();
  }

  const element = document.getElementById(`lives-${playerId}`);
  element.innerHTML = `Lives: ${gameState.players[playerId - 1].Lives}`;
  element.className = `playerInfoBox-lives playerId-${playerId}`;
}
