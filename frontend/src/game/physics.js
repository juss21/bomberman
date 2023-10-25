import { frameCapping } from "../index.js";
import { tileSize, characterSize } from "./board.js";
import { levelMaps } from "./maps/mapBuilder.js";
import { refreshRate } from "./overlay.js";

let animationId = null;
const keysPressed = {};

export function movePlayer(event) {
    const player = document.getElementById("Player-1");

    if (event.key === " ") {
        plantBomb(player);
        return;
    }

    keysPressed[event.key] = true;

    if (animationId) return;

    function moveAnimation() {
        const speed = (3 * 60) / refreshRate;

        console.log(speed)
        let left = parseInt(player.style.left);
        let top = parseInt(player.style.top);

        if (keysPressed["W"] || keysPressed["w"] || keysPressed["ArrowUp"]) {
            //animation siia
            if (checkCollision(left, top - speed)) {
                player.style.top = top - speed + "px";
                //websocket event siia
            }
        }
        if (keysPressed["A"] || keysPressed["a"] || keysPressed["ArrowLeft"]) {
            if (checkCollision(left - speed, top)) {
                player.style.left = left - speed + "px";
            }
        }
        if (keysPressed["S"] || keysPressed["s"] || keysPressed["ArrowDown"]) {
            if (checkCollision(left, top + speed)) {
                player.style.top = top + speed + "px";
            }
        }
        if (keysPressed["D"] || keysPressed["d"] || keysPressed["ArrowRight"]) {
            if (checkCollision(left + speed, top)) {
                player.style.left = left + speed + "px";
            }
        }

        animationId = requestAnimationFrame(moveAnimation);
    }
    animationId = requestAnimationFrame(moveAnimation);
}

export function stopAnimation(event) {
    delete keysPressed[event.key];

    if (Object.keys(keysPressed).length === 0) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

export function checkCollision(x, y) {
    // Calculate the character's tile positions for all four corners
    let characterTileX1 = Math.floor(x / tileSize);
    let characterTileY1 = Math.floor(y / tileSize);
    let characterTileX2 = Math.floor((x + characterSize) / tileSize);
    let characterTileY2 = Math.floor((y + characterSize) / tileSize);

    // Check if any of the character's four corners is on a collision tile
    for (let i = characterTileY1; i <= characterTileY2; i++) {
        for (let j = characterTileX1; j <= characterTileX2; j++) {
            let currentTile = levelMaps[0][0][i][j];
            if (
                currentTile !== "_" &&
                currentTile !== "1" &&
                currentTile !== "2" &&
                currentTile !== "3" &&
                currentTile !== "4"
            ) {
                return false;
            }
        }
    }
    return true;
}

function plantBomb(player) { }
