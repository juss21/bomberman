import { changeTile, tileSize, characterSize, LevelMap } from "./board.js";
import { loseLife } from "./characterphysics.js";
import { gameState } from "./gameState.js";
import { sendEvent } from "./websocket.js";

export let canMoveThroughBomb = false;
const bombTimers = {};

export function setCanMoveThroughBomb(value) {
  canMoveThroughBomb = value;
}

function createExplosion(x, y, currentTile, playerId) {
  const xTile = x / tileSize;
  const yTile = y / tileSize - 1;
  changeTile(xTile, yTile, "explosion");

  console.log("current: ", playerId);

  let characterTileX1 = Math.floor(
    gameState.players[playerId - 1].X / tileSize
  );
  let characterTileY1 = Math.floor(
    gameState.players[playerId - 1].Y / tileSize
  );
  let characterTileX2 = Math.floor(
    (gameState.players[playerId - 1].X + characterSize) / tileSize
  );
  let characterTileY2 = Math.floor(
    (gameState.players[playerId - 1].Y + characterSize) / tileSize
  );

  if (
    (characterTileX1 === xTile && characterTileY1 === yTile) ||
    (characterTileX2 === xTile && characterTileY2 === yTile)
  ) {
    loseLife(playerId - 1);
  }

  // Set a timer to remove the explosion elements after a certain duration
  const explosionDuration = 500;
  setTimeout(() => {
    let newTile;
    if (currentTile === "j") newTile = "speed";
    else if (currentTile === "l") newTile = "blast";
    else if (currentTile === "p") newTile = "bomb";
    else newTile = "_";
    changeTile(xTile, yTile, newTile);
  }, explosionDuration);

  if (bombTimers[xTile] && bombTimers[xTile][yTile]) {
    clearTimeout(bombTimers[xTile][yTile]);
    delete bombTimers[xTile][yTile];
  }
}

function explosionCollision(x, y, playerId) {
  let explosionTileX1 = x / tileSize;
  let explosionTileY1 = y / tileSize - 1;
  let currentTile = LevelMap[explosionTileY1][explosionTileX1];
  if (currentTile === "!") {
    bombExplosion(x, y, explosionTileX1, explosionTileY1, playerId);
  }
  if (
    currentTile === "b" ||
    currentTile === "j" ||
    currentTile === "l" ||
    currentTile === "p"
  ) {
    createExplosion(x, y, currentTile, playerId);
    return false;
  } else if (
    currentTile !== "_" &&
    currentTile !== "1" &&
    currentTile !== "2" &&
    currentTile !== "3" &&
    currentTile !== "4" &&
    currentTile !== "bomb" &&
    currentTile !== "blast" &&
    currentTile !== "speed"
  ) {
    return false;
  }
  return true;
}

export function plantBomb(player, playerId) {
  const playerRect = player.getBoundingClientRect();
  const playerLeft = playerRect.left;
  const playerTop = playerRect.top;

  canMoveThroughBomb = true;

  let explosionTileY = Math.round(playerTop / tileSize) - 1;
  let explosionTileX = Math.round(playerLeft / tileSize);

  let currentTile = LevelMap[explosionTileY][explosionTileX];
  if (currentTile !== "explosion" && currentTile !== "!") {
    gameState.players[playerId - 1].Bombs -= 1;
    sendEvent("bomb_placed", {
      PlayerId: playerId,
      BombX: explosionTileX,
      BombY: explosionTileY,
    });
    spawnBomb(playerId, explosionTileX, explosionTileY);
  }
}

export function spawnBomb(playerId, X, Y) {
  changeTile(X, Y, "!");
  createBombTimer(X, Y, playerId);
}

function createBombTimer(x, y, playerId) {
  // Create a timer for the bomb at location x, y
  const bombExplodeDelay = 2000;
  bombTimers[x] = bombTimers[x] || {};
  bombTimers[x][y] = setTimeout(() => {
    bombExplosion(x * tileSize, (y + 1) * tileSize, x, y, playerId);
  }, bombExplodeDelay);
}

function bombExplosion(
  bombPositionX,
  bombPositionY,
  explosionTileX,
  explosionTileY,
  playerId
) {
  gameState.players[playerId - 1].Bombs += 1;
  changeTile(explosionTileX, explosionTileY, "_");
  createExplosion(bombPositionX, bombPositionY, "", playerId);
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1], // Right, Left, Down, Up
  ];

  for (const [dx, dy] of directions) {
    let x = bombPositionX;
    let y = bombPositionY;

    for (let i = 0; i < gameState.players[playerId - 1].BlastRange; i++) {
      x += dx * tileSize;
      y += dy * tileSize;

      if (!explosionCollision(x, y, playerId)) {
        break;
      }
      createExplosion(x, y, "", playerId);
    }
  }
}
