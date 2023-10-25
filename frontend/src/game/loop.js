import { addEventListenerToElement } from "../../dist/framework.js";
import { frameCapping } from "../index.js";
import { frameRate } from "./overlay.js";
import { movePlayer, stopAnimation } from "./physics.js";
import { sendEvent } from "./websocket.js";

// current state of game
const gameState = {
  players: [], //players
  bombs: [], //bombs placed
  powerUps: [], //powerups dropped
  map: [], //2d map array status (boxes to-be destroyed) (json.stringify(LevelMaps[0][0]))
  chat: [], //chat log
};

/* frame limattion */
let animationFrameId = null;
const targetFrameRate = 60;
let frameTimes = [];
const frameDuration = 1000 / targetFrameRate;

let lastFrameTime = 0;

/* game loop  */
export function gameLoop() {
  if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);

  // game logic, gamestate update
  frameRate(frameTimes);

  // socket.send(JSON.stringify(gameState)); // sending updated gameState
  // ..

  // Limiting frame rate by delaying the next frame if necessary
    animationFrameId = requestAnimationFrame(gameLoop);
}

export function playerMovement() {
  addEventListenerToElement(window, "keydown", movePlayer);
  addEventListenerToElement(window, "keyup", stopAnimation);
}
