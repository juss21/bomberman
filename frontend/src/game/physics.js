import { frameCapping } from "../index.js";
import { tileSize, characterSize } from "./board.js";
import { levelMaps } from "./maps/mapBuilder.js";
import { refreshRate } from "./overlay.js";

let animationId = null;
const keysPressed = {};
let translateX = 0;
let translateY = 0;
let playerSpeed = 3;

export function movePlayer(event) {
    const player = document.getElementById("Player-1");
    let left = parseInt(player.style.left);
    let top = parseInt(player.style.top);

    if (event.key === " ") {
        plantBomb(player);
        return;
    }

    keysPressed[event.key] = true;

    if (animationId) return;

    function moveAnimation() {
        const speed = (playerSpeed * 60) / refreshRate;

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
        player.style.transform = `translate(${translateX}px, ${translateY}px)`;

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

export function characterCollision(x, y) {
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

function createExplosion(x, y) {
    const explosion = document.createElement("div");
    explosion.className = "explosion";

    explosion.style.left = x + "px";
    explosion.style.top = y + "px";

    document.body.appendChild(explosion);
}

function explosionCollision(x, y) {
    let explosionTileX1 = x / tileSize;
    let explosionTileY1 = (y / tileSize) - 1;
    let currentTile = levelMaps[0][0][explosionTileY1][explosionTileX1];
    console.log(explosionTileX1, explosionTileY1, currentTile)

    if (currentTile === "b") {
        const tile = document.getElementById("tile" + explosionTileY1);
        const img = tile.querySelector("#img" + explosionTileX1);
        img.src = `src/game/sprites/level0${1}/${"_"}.png`;
        levelMaps[0][0][explosionTileY1][explosionTileX1] = "_";
        createExplosion(x, y);
        return false
    } else if (
        currentTile !== "_" &&
        currentTile !== "1" &&
        currentTile !== "2" &&
        currentTile !== "3" &&
        currentTile !== "4"
    ) {
        return false;
    }
    return true;
}

function plantBomb(player) {
    const bomb = document.createElement("div");
    bomb.className = "bomb";
    const gridSize = 60;

    const playerRect = player.getBoundingClientRect();
    const playerLeft = playerRect.left;
    const playerTop = playerRect.top;

    const bombPositionX = Math.round(playerLeft / gridSize) * gridSize;
    const bombPositionY = Math.round(playerTop / gridSize) * gridSize;

    bomb.style.left = bombPositionX + "px";
    bomb.style.top = bombPositionY + "px";

    document.body.appendChild(bomb);

    const bombExplodeDelay = 2000;
    setTimeout(() => {
        // bomb.parentNode.removeChild(bomb);
        bombExplosion(bomb, bombPositionX, bombPositionY);
        // Implement logic for the bomb's explosion here
        // You can damage nearby objects or tiles, etc.
    }, bombExplodeDelay);
}

function bombExplosion(bomb, bombPositionX, bombPositionY) {

    bomb.parentNode.removeChild(bomb);
    const blastRange = 2;

    let stopExploding = false;

    for (let i = 0; i <= blastRange && !stopExploding; i++) {
        if (explosionCollision((bombPositionX + i * 60), bombPositionY)) {
            createExplosion(bombPositionX + i * 60, bombPositionY);
        } else stopExploding = true
    }
    stopExploding = false;

    for (let i = 0; i >= -blastRange && !stopExploding; i--) {
        if (explosionCollision((bombPositionX + i * 60), bombPositionY)) {
            createExplosion(bombPositionX + i * 60, bombPositionY);
        } else stopExploding = true
    }
    stopExploding = false;

    for (let j = 0; j >= -blastRange && !stopExploding; j--) {
        if (explosionCollision(bombPositionX, bombPositionY + j * 60)) {
            createExplosion(bombPositionX, bombPositionY + j * 60);
        } else stopExploding = true
    }

    stopExploding = false;
    for (let j = 0; j <= blastRange && !stopExploding; j++) {
        if (explosionCollision(bombPositionX, bombPositionY + j * 60)) {
            createExplosion(bombPositionX, bombPositionY + j * 60);
        } else stopExploding = true
    }

    // Set a timer to remove the explosion elements after a certain duration
    const explosionDuration = 500;
    setTimeout(() => {
        const explosions = document.querySelectorAll(".explosion");
        explosions.forEach((explosion) => explosion.parentNode.removeChild(explosion));
    }, explosionDuration);
}
