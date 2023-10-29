import { createGameHTML, lobbyMenu, toggleMenuHide } from "./createHtml.js";
import { sendEvent } from "./websocket.js";
import { playerMovement, gameLoop } from "./loop.js";
import { changeTile, drawTiles } from "./board.js";
import { YourName, Lives, PlayingAs } from "./overlay.js";
import { updateChatBox } from "./chat.js";
import { updateGameState_player } from "./gameState.js";
import { spawnBomb } from "./bombphysics.js";
import { loseLife } from "./characterphysics.js";
export const eventHandlers = {
  playerId: onConnection,
  "max-slots": onBadConnection,
  currentlevel: onNewMapLayout,

  update_chatbox: updateChatBox, // add chat message

  update_gamestate_players: handleUpdateGameStatePlayers,
  new_bomb: handleNewBomb,
  changeTile: handleChangeTile,
  update_lives: loseLife
};

function onConnection(payload) {
  const playerId = payload;
  console.log("Server has set us as player:", `Player-${playerId}`);

  localStorage.setItem("Player", playerId);

  // requesting current map layout
  sendEvent("request_map", {
    playerId: playerId,
  });
}

function onBadConnection() {
  console.log("Lobby is full!");
  alert("Lobby is full, please try again later!");
}

function onNewMapLayout(map) {
  console.log("currentmap:", map);

  lobbyMenu();

  let waitTime = 10; // initial wait time in seconds
  const lobbyCountDown = document.getElementById("lobbyCountDown");
  const CountDownMessage = (time) => {
    return `Game will begin in ${time} seconds!`;
  };
  console.log("Waiting for " + waitTime + " seconds...");

  let countdownInterval = setInterval(function () {
    waitTime--;
    gameLoop(); // viskasin selle siia, muidu alguses arvutab movement speedi valesti
    if (waitTime < 30) {
      lobbyCountDown.innerHTML = CountDownMessage(waitTime);
      console.log("Waiting for " + waitTime + " seconds...");
    }
    if (waitTime <= 0) {
      clearInterval(countdownInterval); // clear the interval when countdown reaches 0

      // start game
      toggleMenuHide(true); // "hide menu"
      createGameHTML(); // create tilemap etc html structure
      drawTiles(map); // render map

      playerMovement(); // start listening for player movements
      //gameLoop(); // start the game loop

      // fill overlay info
      YourName();
      PlayingAs();
      Lives();
    }
  }, 1000);
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
