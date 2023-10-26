import { backendHost } from "../index.js";
import { fillGameState, updateGameState_player } from "./gameState.js";
import { gameLoop, playerMovement } from "./loop.js";
export class Event {
  constructor(type, payload) {
    this.type = type;
    this.payload = payload;
  }
}
export function startWebSocketConnction() {
  return new Promise((resolve, reject) => {
    if (window["WebSocket"]) {
      const ws = new WebSocket(`ws://${backendHost}/ws`);

      ws.onopen = () => {
        console.log("WebSocket Connection established!");
        sendEvent("request_playerid");
        sendEvent("request_map");
        fillGameState(); // create/fill gameState
        playerMovement(); // start listening for player movements
        gameLoop(); // start the game loop
        resolve(ws); // Resolve the promise with the WebSocket object when the connection is established.
      };
      ws.onclose = (e) => {
        console.log("WebSocket connection Lost! Is the server running?", e);
        location.reload();
        resolve(e);
      };
      ws.onmessage = (event) => {
        console.log("WS Message received!");
        const message = JSON.parse(event.data);

        console.log("ws:message:received ->", message);

        if (message.type === "playerId") {
          const playerId = message.payload;

          console.log("Server has set us as player:", `Player-${playerId}`);

          localStorage.setItem("Player", playerId);
        } else if (message.type === "max-slots") {
          console.log("Lobby is full!");
        } else if (message.type === "update_gamestate_players") {
          const payload = message.payload;
          updateGameState_player(
            payload.PlayerId,
            payload.PlayerNewX,
            payload.PlayerNewY
          );
        }
      };

      window.socket = ws;
      window.addEventListener("beforeunload", function () {
        ws.close();
      });
    } else {
      alert("This browser does not support websockets!");
      reject(new Error("WebSocket not supported"));
    }
  });
}
export function sendEvent(type, payload) {
  // console.log("Sendinng event:", payload);
  const event = new Event(type, payload);
  window.socket.send(JSON.stringify(event));
}
