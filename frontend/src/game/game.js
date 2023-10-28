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
