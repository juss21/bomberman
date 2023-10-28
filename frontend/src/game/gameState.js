import { Player1, Player2, Player3, Player4 } from "./board.js";
import { moveOtherPlayer } from "./characterphysics.js";
// current state of game
export const gameState = {
  players: [], //players
  chat: [], //chat log
};

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

  const newX = gameState.players[PlayerIndex].X;
  const newY = gameState.players[PlayerIndex].Y;

  updatePlayerCoordinates(playerID, newX, newY);
}

function playerObject(Player) {
  if (Player.X === 0 || Player.Y === 0) return undefined; // if player does not exist // not on board
  return {
    ID: Player.ID,
    X: Player.X,
    Y: Player.Y,
    Lives: 3,
    Bombs: 1,
    Speed: 3,
    BlastRange: 1,
    Invincible: false,
  };
}

export function fillGameState_player() {
  const p1 = playerObject(Player1);
  const p2 = playerObject(Player2);
  const p3 = playerObject(Player3);
  const p4 = playerObject(Player4);

  if (p1) gameState.players.push(p1);
  if (p2) gameState.players.push(p2);
  if (p3) gameState.players.push(p3);
  if (p4) gameState.players.push(p4);
}
