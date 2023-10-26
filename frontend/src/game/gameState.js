import { Player1, Player2, Player3, Player4 } from "./board.js";
import { moveOtherPlayer } from "./characterphysics.js";
// current state of game
export const gameState = {
  players: [], //players
  bombs: [], //bombs placed
  powerUps: [], //powerups dropped
  map: [], //2d map array status (boxes to-be destroyed) (json.stringify(LevelMaps[0][0]))
  chat: [], //chat log
};

export function updatePlayerCoordinates(playerId, newX, newY) {
  const playerIndex = gameState.players.findIndex(
    (player) => player.id === playerId
  );

  if (playerIndex !== -1) {
    // Player found, update coordinates
    gameState.players[playerIndex].x = parseInt(newX);
    gameState.players[playerIndex].y = parseInt(newY);

    if (
      gameState.players[playerIndex] != parseInt(localStorage.getItem("Player"))
    )
      moveOtherPlayer(playerId, newX, newY);
  } else {
    console.error("Invalid player ID", playerId, playerIndex);
  }
}

export function updateGameState_player(playerID, newX, newY) {
  // find the user that sent update to the others
  const PlayerIndex = gameState.players.findIndex(
    (player) => player.ID === playerID
  );

  // if (PlayerIndex !== -1 && PlayerIndex) {
  // gameState.players[PlayerIndex].X = newX;
  // gameState.players[PlayerIndex].Y = newY;
  // }

  updatePlayerCoordinates(playerID, newX, newY);
}

function playerObject(Player) {
  if (Player.X === 0 || Player.Y === 0) return undefined; // if player does not exist // not on board
  return {
    id: Player.ID,
    x: Player.X,
    y: Player.Y,
    lives: 3,
    bombs: 1,
    flameRange: 1,
    speed: 3,
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

  console.log("gamestate:", gameState);
}
