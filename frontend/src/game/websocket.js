import { backendHost } from "../index.js";
import { addEventListenerToElement } from "../../dist/framework.js";
import { gameLoop, playerMovement } from "./loop.js";
class Event {
  constructor(type, payload) {
    this.type = type;
    this.payload = payload;
  }
}

let socket;

function updateGameState(serverData) {
  console.log("updating gamestate:", serverData);
}

export function startWebSocketConnction() {
  socket = new WebSocket(`ws://${backendHost}/ws`);

  addEventListenerToElement(socket, "open", (e) => {
    console.log("WebSocket connection established.", e);
    playerMovement(); // start listening for player movements
    gameLoop(); // start the game loop
  });

  addEventListenerToElement(socket, "message", (event) => {
    updateGameState(JSON.parse(event.data));
  });

  addEventListenerToElement(socket, "error", (error) => {
    console.error("WebSocket error:", error);
  });

  addEventListenerToElement(socket, "close", (e) => {
    console.log(`WebSocket connection closed. (${e})`);
  });
}

export function sendEvent(type, payload) {
  const event = new Event(type, payload);

  socket.send(JSON.stringify(event));
}
