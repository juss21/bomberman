import { tileSize, characterSize, changeTile, LevelMap } from "./board.js";

import { refreshRate } from "./overlay.js";
import {
  plantBomb,
  setCanMoveThroughBomb,
  canMoveThroughBomb,
} from "./bombphysics.js";
import { sendEvent } from "./websocket.js";
import { gameState, updatePlayerCoordinates } from "./gameState.js";
import { loseLife } from "./game.js";
let animationId = null;
const keysPressed = {};
let translateX = 0;
let translateY = 0;

export function movePlayer(event) {
  const playerId = parseInt(localStorage.getItem("Player"));
  if (gameState.players[playerId-1].lives < 1) return;
  if (!playerId || playerId === 0 || playerId > 4) {
    console.log("PlayerId has not been given, please restart your game!");
    return;
  }
  const player = document.getElementById(`Player-${playerId}`);
  let left = parseInt(player.style.left);
  let top = parseInt(player.style.top);

  if (event.key === " " && gameState.players[playerId-1].bombs > 0) {
    plantBomb(player, playerId);
    return;
  }

  keysPressed[event.key] = true;

  if (animationId) return;

  function moveAnimation() {
    const speed = (gameState.players[playerId-1].speed * 60) / refreshRate;

    // Calculate new translations based on key presses
    if (keysPressed["W"] || keysPressed["w"] || keysPressed["ArrowUp"]) {
      if (characterCollision(left + translateX, top + translateY - speed)) {
        translateY = translateY - speed;
      }
    }
    if (keysPressed["A"] || keysPressed["a"] || keysPressed["ArrowLeft"]) {
      if (characterCollision(left + translateX - speed, top + translateY)) {
        translateX = translateX - speed;
      }
    }
    if (keysPressed["S"] || keysPressed["s"] || keysPressed["ArrowDown"]) {
      if (characterCollision(left + translateX, top + translateY + speed)) {
        translateY = translateY + speed;
      }
    }
    if (keysPressed["D"] || keysPressed["d"] || keysPressed["ArrowRight"]) {
      if (characterCollision(left + translateX + speed, top + translateY)) {
        translateX = translateX + speed;
      }
    }
    updatePlayerCoordinates(playerId, translateX, translateY);
    player.style.transform = `translate(${translateX}px, ${translateY}px)`;
    if (animationId !== null) {
      sendEvent("send_player_location", {
        PlayerId: playerId,
        GameState: { players: gameState.players },
      }); // repeatedly update your position
    }
    animationId = requestAnimationFrame(moveAnimation);
  }
  animationId = requestAnimationFrame(moveAnimation);
}

export function moveOtherPlayer(playerId, X, Y) {
  if (parseInt(localStorage.getItem("Player")) !== playerId) {
    const player = document.getElementById(`Player-${playerId}`);
    if (player) {
      player.style.transform = `translate(${X}px, ${Y}px)`;
    }
  }
}

export function stopAnimation(event) {
  delete keysPressed[event.key];

  if (Object.keys(keysPressed).length === 0) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

export function characterCollision(x, y) {
  // Calculate the character's tile positions for all four corners
  let characterTileX1 = Math.floor(x / tileSize);
  let characterTileY1 = Math.floor(y / tileSize);
  let characterTileX2 = Math.floor((x + characterSize) / tileSize);
  let characterTileY2 = Math.floor((y + characterSize) / tileSize);

  if (
    canMoveThroughBomb &&
    LevelMap[characterTileY1][characterTileX1] !== "!" &&
    LevelMap[characterTileY1][characterTileX2] !== "!" &&
    LevelMap[characterTileY2][characterTileX1] !== "!" &&
    LevelMap[characterTileY2][characterTileX2] !== "!"
  ) setCanMoveThroughBomb(false);

  // Check if any of the character's four corners is on a collision tile
  for (let i = characterTileY1; i <= characterTileY2; i++) {
    for (let j = characterTileX1; j <= characterTileX2; j++) {
      let currentTile = LevelMap[i][j];
      if (canMoveThroughBomb && currentTile === "!") {
        continue;
      }

      if (!isValidCollisionTile(currentTile)) {
        return false;
      }

      handleCollisionTile(currentTile, j, i);
    }
  }

  return true;
}

function isValidCollisionTile(currentTile) {
  const nonBlockingTiles = ["_", "1", "2", "3", "4", "explosion", "bomb", "blast", "speed"];
  return nonBlockingTiles.includes(currentTile);
}

function handleCollisionTile(currentTile, x, y) {
  const playerId = parseInt(localStorage.getItem("Player"));
  switch (currentTile) {
    case "explosion":
      loseLife(playerId-1);
      break;
    case "bomb":
      gameState.players[playerId-1].bombs += 1;
      break;
    case "blast":
      gameState.players[playerId-1].blastRange += 1;
      break;
    case "speed":
      gameState.players[playerId-1].speed += 1;
      break;
  }

  if (["bomb", "blast", "speed"].includes(currentTile)) {
    changeTile(x, y, "_");
    sendEvent("request_changeTile", {
      playerId: parseInt(localStorage.getItem("Player")),
      TileX: x,
      TileY: y,
    });
  }
}