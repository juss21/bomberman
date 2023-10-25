import { addEventListenerToElement } from "../../dist/framework.js";
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
const targetFrameRate = 60;
const frameDuration = 1000 / targetFrameRate;

let lastFrameTime = 0;

/* game loop  */
export function gameLoop(timestamp) {
  const deltaTime = timestamp - lastFrameTime; // time elapsed since last frame

  // game logic, gamestate update

  // socket.send(JSON.stringify(gameState)); // sending updated gameState
  // ..

  lastFrameTime = timestamp;

  // Limiting frame rate by delaying the next frame if necessary
  const timeToNextFrame = frameDuration - deltaTime;
  if (timeToNextFrame > 0) {
    setTimeout(() => {
      requestAnimationFrame(gameLoop);
    }, timeToNextFrame);
  } else {
    requestAnimationFrame(gameLoop);
  }
}

export function playerMovement() {
  addEventListenerToElement(window, "keydown", movePlayer);
  addEventListenerToElement(window, "keyup", stopAnimation);
}
