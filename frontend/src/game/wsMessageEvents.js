import { lobbyMenu } from "./createHtml.js";
import { sendEvent } from "./websocket.js";
import { changeTile, setLevelMap } from "./board.js";
import { updateChatBox } from "./chat.js";
import { gameState, updateGameState_player } from "./gameState.js";
import { spawnBomb } from "./bombphysics.js";
import { loseLife } from "./characterphysics.js";
import { RenderGame } from "./game.js";
export const eventHandlers = {
  "lobby-joined": onConnection,
  "lobby-full": onBadConnection,
  "lobby-update": onLobbyUpdate,
  "lobby-countdown": lobbyTimeLeft,
  "request-countdown-sync": lobbyCountDownSync,
  update_chatbox: updateChatBox, // add chat message

  update_gamestate_players: handleUpdateGameStatePlayers,
  new_bomb: handleNewBomb,
  changeTile: handleChangeTile,
  update_lives: loseLife,
};

function onConnection(payload) {
  const { PlayerId, CurrentLevel } = payload;
  console.log("Server has set us as player:", `Player-${PlayerId}`);

  localStorage.setItem("Player", PlayerId);

  // on connection ->  set gamestate connection status to true

  setLevelMap(CurrentLevel);

  lobbyMenu();

  sendEvent("update_lobby", { PlayerId: PlayerId }); // send update message to other users
}

function onBadConnection(payload) {
  alert(payload);
}

function onLobbyUpdate(payload) {
  const { Players } = payload;

  console.log("players:", Players);

  for (let i = 0; i < Players.length; i++) {
    const element = document.getElementById(`Player-${Players[i].PlayerId}`);
    element.className = "lobbyPlayer Connected";

    gameState.players[i].Connected = true;

    const playerContainerElement = document.getElementById(
      `playerInfoContainer-${i + 1}`
    );
    playerContainerElement.style.filter = "blur(0px)"; // You can adjust the blur radius (5px in this case) according to your preference

    const element2 = document.getElementById(
      `lobby-slot-${Players[i].PlayerId}`
    );

    element2.innerHTML = Players[i].PlayerName;
  }
}

var WaitTime = 1000;
var countdownInterval;
function lobbyTimeLeft(payload) {
  const { Players, TimeLeft } = payload;
  console.log("timeleft:", TimeLeft, payload);
  WaitTime = TimeLeft;
  if (typeof WaitTime === "number") {
    const lobbyCountDown = document.getElementById("lobbyCountDown");
    const CountDownMessage = (time) => {
      return `Game will begin in ${time} seconds!`;
    };

    // Clear the previous countdown interval if it exists
    clearInterval(countdownInterval);

    countdownInterval = setInterval(function () {
      WaitTime--;
      if (WaitTime < 30) {
        lobbyCountDown.innerHTML = CountDownMessage(WaitTime);
        console.log("Waiting for " + WaitTime + " seconds...");
      }

      if (WaitTime <= 0) {
        clearInterval(countdownInterval); // clear the interval when countdown reaches 0
        RenderGame();
        WaitTime = 1000;
      }
    }, 1000);
  }
}

function lobbyCountDownSync() {
  sendEvent("send-countdown-sync", { NewTime: WaitTime });
}

function handleUpdateGameStatePlayers(payload) {
  const { PlayerId, GameState } = payload;
  updateGameState_player(PlayerId, GameState);
}

function handleNewBomb(payload) {
  const { PlayerId, BombX, BombY } = payload;
  spawnBomb(PlayerId, BombX, BombY);
}

function handleChangeTile(payload) {
  changeTile(payload.TileX, payload.TileY, "_");
}
