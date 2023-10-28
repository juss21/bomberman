import { backendHost } from "../index.js";
import { eventHandlers } from "./wsMessageEvents.js";
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
        sendEvent("request_playerid"); // request a lobby position / playerid from backend
        resolve(ws);
      };
      ws.onclose = (e) => {
        console.log("WebSocket connection Lost! Is the server running?", e);
        location.reload(); // refresh page
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
  // only if has active ws connection
  if (window.socket) {
    const event = new Event(type, payload);
    window.socket.send(JSON.stringify(event));
  } else {
    console.log("WebSocket not connected, skipping event:", type);
  }
}
