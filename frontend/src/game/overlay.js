import { InGame, setInGame } from "./board.js";
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
  if (parseInt(fps) > 60) refreshRate = parseInt(fps) - 1;
  let fpsElement = document.getElementById("fps");
  if (fpsElement) {
    fpsElement.innerHTML = "FPS: " + fps;
  }
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

export function Lives(id) {
  const element = document.getElementById("lives");
  element.innerHTML = `Lives: ${gameState.players[id - 1].Lives}`;
  element.className = `playerId-${id}`;
}

export function updatePlayerLifeCounter(playerId) {
  console.log("updating player lives:", playerId);
  const localPlayer = parseInt(localStorage.getItem("Player"));
  if (playerId + 1 === localPlayer) {
    Lives(localPlayer);
   // return;
  }

  // update for statistics'
  console.log("updating stats");
  const element = document.getElementById(`lives-${playerId + 1}`);
  console.log("element", element);
  if (element) {
    element.innerHTML = `Lives: ${gameState.players[playerId].Lives}`;
    element.className = `playerInfoBox-lives playerId-${playerId}`;
  }
  // blur filter
  if (gameState.players[playerId].Lives === 0) {
    const element = document.getElementById(
      `playerInfoContainer-${playerId + 1}`
    );

    if (element) {
      element.style.filter = "blur(5px)"; // You can adjust the blur radius (5px in this case) according to your preference
      console.log(element, "died!");
    }
  }
}
