import { backendHost } from "../index.js";
import { changeTile, drawTiles } from "./board.js";
import { spawnBomb } from "./bombphysics.js";
import { updateGameState_player } from "./gameState.js";
import { gameLoop, playerMovement } from "./loop.js";
export class Event {
  constructor(type, payload) {
    this.type = type;
    this.payload = payload;
  }
}

const eventHandlers = {
  playerId: handlePlayerId,
  "max-slots": handleMaxSlots,
  update_gamestate_players: handleUpdateGameStatePlayers,
  currentlevel: handleCurrentLevel,
  new_bomb: handleNewBomb,
  changeTile: handleChangeTile,
};

export function startWebSocketConnction() {
  return new Promise((resolve, reject) => {
    if (window["WebSocket"]) {
      const ws = new WebSocket(`ws://${backendHost}/ws`);

      ws.onopen = () => {
        console.log("WebSocket Connection established!");
        sendEvent("request_playerid");

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
        const message = JSON.parse(event.data);

        const handler = eventHandlers[message.type];
        if (handler) {
          handler(message.payload);
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
  const event = new Event(type, payload);
  window.socket.send(JSON.stringify(event));
}

function handlePlayerId(payload) {
  const playerId = payload;

  console.log("Server has set us as player:", `Player-${playerId}`);

  localStorage.setItem("Player", playerId);
  sendEvent("request_map", {
    playerId: playerId,
  });
}

function handleMaxSlots() {
  console.log("Lobby is full!");
}

function handleUpdateGameStatePlayers(payload) {
  const { PlayerId, GameState } = payload;
  updateGameState_player(PlayerId, GameState);
}

function handleCurrentLevel(payload) {
  drawTiles(payload);
}

function handleNewBomb(payload) {
  const { PlayerId, BombX, BombY } = payload;
  spawnBomb(PlayerId, BombX, BombY);
}

function handleChangeTile(payload) {
  changeTile(payload.TileX, payload.TileY, "_");
}
