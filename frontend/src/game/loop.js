import { addEventListenerToElement } from "../../dist/framework.js";
import { frameRate } from "./overlay.js";
import { movePlayer, stopAnimation } from "./characterphysics.js";

/* frame limattion */
let animationFrameId = null;
const targetFrameRate = 60;
let frameTimes = [];
const frameDuration = 1000 / targetFrameRate;

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
