import { Player1, Player2, Player3, Player4 } from "./board.js";
import { moveOtherPlayer } from "./characterphysics.js";
// current state of game
export const gameState = {
  players: [],
};

function playerObject(Player) {
  return {
    ID: Player.ID,
    X: Player.X,
    Y: Player.Y,
    Lives: 3,
    Bombs: 1,
    Speed: 3,
    BlastRange: 1,
    Invincible: false,
    Connected: false,
  };
}

export function fillGameState_player() {
  const object1 = playerObject(Player1);
  const object2 = playerObject(Player2);
  const object3 = playerObject(Player3);
  const object4 = playerObject(Player4);

  gameState.players.push(object1);
  gameState.players.push(object2);
  gameState.players.push(object3);
  gameState.players.push(object4);
}

export function updatePlayerCoordinates(playerId, newX, newY) {
  const playerIndex = gameState.players.findIndex(
    (player) => player.ID === playerId
  );

  if (playerIndex !== -1) {
    // Player found, update coordinates
    gameState.players[playerIndex].X = parseInt(newX);
    gameState.players[playerIndex].Y = parseInt(newY);

    if (
      gameState.players[playerIndex].ID !=
      parseInt(localStorage.getItem("Player"))
    )
      moveOtherPlayer(playerId, newX, newY);
  } else {
    console.error("Invalid player ID", playerId, playerIndex);
  }
}

export function updateGameState_player(playerID, GameState) {
  // find the user that sent update to the others
  const PlayerIndex = gameState.players.findIndex(
    (player) => player.ID === playerID
  );

  gameState.players[PlayerIndex] = GameState;

  gameState.players[PlayerIndex].Connected = true; // set the connected status true

  const newX = gameState.players[PlayerIndex].X;
  const newY = gameState.players[PlayerIndex].Y;

  updatePlayerCoordinates(playerID, newX, newY);
}

export function updateConnectionStatus(PlayerId, Connected) {
  if (!Connected) gameState.players[PlayerId - 1].Lives = 0;
}
