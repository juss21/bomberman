import { addChatMessage } from "./createHtml.js";
import { sendEvent } from "./websocket.js";

export function sendChatMessage(chatBar, event) {
  const localPlayerID = parseInt(localStorage.getItem("Player"));
  const localPlayerName = localStorage.getItem("PlayerName");

  if (event.key === "Enter") {
    event.preventDefault();

    sendEvent("send_message", {
      PlayerId: localPlayerID,
      PlayerName: localPlayerName,
      Message: chatBar.value,
    });

    chatBar.value = "";
  }
}

export function updateChatBox(payload) {
  const { PlayerId, PlayerName, Message } = payload;
  addChatMessage(Message, PlayerId, PlayerName);
}
