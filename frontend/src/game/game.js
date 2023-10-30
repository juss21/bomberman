import { LevelMap, drawTiles } from "./board.js";
import { createGameHTML, toggleMenuHide } from "./createHtml.js";
import { gameLoop, playerMovement } from "./loop.js";
import { Lives, PlayingAs, YourName } from "./overlay.js";
import { startWebSocketConnction } from "./websocket.js";

export function StartGame(offline, playerName = "Player1") {
  if (offline) {
    console.log("game started.");

    // offline (endless gamemode) play, must fetch map from backend!
  } else {
    console.log("lobby entered.");
    localStorage.setItem("PlayerName", playerName);
    startWebSocketConnction(); // set up a websocket connection
  }
}

export function RenderGame() {
  gameLoop(); // viskasin selle siia, muidu alguses arvutab movement speedi valesti

  const localPlayer = parseInt(localStorage.getItem("Player"));
  // start game
  toggleMenuHide(true); // "hide menu"
  createGameHTML(); // create tilemap etc html structure
  drawTiles(LevelMap); // render map

  playerMovement(); // start listening for player movements
  //gameLoop(); // start the game loop

  // fill overlay info
  YourName();
  PlayingAs();
  Lives(localPlayer);
}
