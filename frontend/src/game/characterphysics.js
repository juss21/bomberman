import { tileSize, characterSize, changeTile, LevelMap } from "./board.js";

import { refreshRate } from "./overlay.js";
import {
  plantBomb,
  setCanMoveThroughBomb,
  canMoveThroughBomb,
} from "./bombphysics.js";
import { sendEvent } from "./websocket.js";
import { gameState, updatePlayerCoordinates } from "./gameState.js";
import { playerData, loseLife } from "./game.js";
let animationId = null;
const keysPressed = {};
let translateX = 0;
let translateY = 0;

export function movePlayer(event) {
  if (playerData.lives < 1) return;
  const playerId = parseInt(localStorage.getItem("Player"));
  if (!playerId || playerId === 0 || playerId > 4) {
    console.log("PlayerId has not been given, please restart your game!");
    return;
  }
  const player = document.getElementById(`Player-${playerId}`);
  let left = parseInt(player.style.left);
  let top = parseInt(player.style.top);

  if (event.key === " " && playerData.bombs > 0) {
    plantBomb(player);
    return;
  }

  keysPressed[event.key] = true;

  if (animationId) return;

  function moveAnimation() {
    const speed = (playerData.speed * 60) / refreshRate;

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
  )
    setCanMoveThroughBomb(false);

  // Check if any of the character's four corners is on a collision tile
  for (let i = characterTileY1; i <= characterTileY2; i++) {
    for (let j = characterTileX1; j <= characterTileX2; j++) {
      let currentTile = LevelMap[i][j];
      if (canMoveThroughBomb && currentTile === "!") {
        continue;
      } else if (
        currentTile !== "_" &&
        currentTile !== "1" &&
        currentTile !== "2" &&
        currentTile !== "3" &&
        currentTile !== "4" &&
        currentTile !== "explosion" &&
        currentTile !== "bomb" &&
        currentTile !== "blast" &&
        currentTile !== "speed"
      ) {
        return false;
      } else if (currentTile === "explosion") {
        loseLife();
      } else if (currentTile === "bomb") {
        playerData.bombs += 1;
        changeTile(j, i, "_");
        sendEvent("request_changeTile", {
          playerId: parseInt(localStorage.getItem("Player")),
          TileX: j,
          TileY: i,
        });
      } else if (currentTile === "blast") {
        playerData.blastRange += 1;
        changeTile(j, i, "_");
        sendEvent("request_changeTile", {
          playerId: parseInt(localStorage.getItem("Player")),
          TileX: j,
          TileY: i,
        });
      } else if (currentTile === "speed") {
        playerData.speed += 1;
        changeTile(j, i, "_");
        sendEvent("request_changeTile", {
          PlayerId: parseInt(localStorage.getItem("Player")),
          TileX: j,
          TileY: i,
        });
      }
    }
  }
  return true;
}
