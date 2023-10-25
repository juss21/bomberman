export class Event {
  constructor(type, payload) {
    this.type = type;
    this.payload = payload;
  }
}

export function sendEvent(type, payload) {
  const event = new Event(type, payload);
  window.socket.send(JSON.stringify(event));
}

export function wsAddConnection() {
  return new Promise((resolve, reject) => {
    if (window["WebSocket"]) {
      let currentUser = JSON.parse(sessionStorage.getItem("CurrentUser"));
      const ws = new WebSocket(
        `ws://localhost:8081/ws?NickName=${currentUser.UserID}`
      );
      ws.onopen = () => {
        console.log("WebSocket Connection established!");
        resolve(ws); // Resolve the promise with the WebSocket object when the connection is established.
      };
      ws.onclose = (e) => {
        console.log("WebSocket connection Lost! Is the server running?", e);
        resolve(e);
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
