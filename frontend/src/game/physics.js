import { frameCapping } from "../index.js";
import { tileSize, characterSize } from "./board.js";
import { levelMaps } from "./maps/mapBuilder.js";
import { refreshRate } from "./overlay.js";

let animationId = null;
const keysPressed = {};
let translateX = 0;
let translateY = 0;

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
        const speed = (3 * 60) / refreshRate;

        // Calculate new translations based on key presses
        if (keysPressed["W"] || keysPressed["w"] || keysPressed["ArrowUp"]) {
            if (checkCollision(left + translateX, top + translateY - speed)) {
                translateY = translateY - speed;
            }
        }
        if (keysPressed["A"] || keysPressed["a"] || keysPressed["ArrowLeft"]) {
            if (checkCollision(left + translateX - speed, top + translateY)) {
                translateX = translateX - speed;
            }
        }
        if (keysPressed["S"] || keysPressed["s"] || keysPressed["ArrowDown"]) {
            if (checkCollision(left + translateX, top + translateY + speed)) {
                translateY = translateY + speed;
            }
        }
        if (keysPressed["D"] || keysPressed["d"] || keysPressed["ArrowRight"]) {
            if (checkCollision(left + translateX + speed, top + translateY)) {
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

function plantBomb(player) {

    const bomb = document.createElement("div");
    bomb.className = "bomb";

    bomb.style.width = "60px";
    bomb.style.height = "60px";
    bomb.style.backgroundColor = "red";

    const gridSize = 60;
    const playerRect = player.getBoundingClientRect();
    const playerLeft = playerRect.left;
    const playerTop = playerRect.top;

    bomb.style.position = "absolute";
    bomb.style.left = playerLeft + "px";
    bomb.style.top = playerTop + "px";

    const bombPositionX = Math.floor(playerLeft / gridSize) * gridSize;
    const bombPositionY = Math.floor(playerTop / gridSize) * gridSize;

    bomb.style.position = "absolute";
    bomb.style.left = bombPositionX + "px";
    bomb.style.top = bombPositionY + "px";

    document.body.appendChild(bomb);

    const bombExplodeDelay = 2000;
    setTimeout(() => {

        // bomb.parentNode.removeChild(bomb);


        bombExplosion(bomb);

        // Implement logic for the bomb's explosion here
        // You can damage nearby objects or tiles, etc.
    }, bombExplodeDelay);
}

function bombExplosion(bomb) {
    // Remove the bomb element
    bomb.parentNode.removeChild(bomb);

    // Calculate the blast range (adjust as needed)
    const blastRange = 2; // For example, a blast range of 3 tiles

    // Calculate the bomb's position within the grid
    const bombPositionX = parseInt(bomb.style.left);
    const bombPositionY = parseInt(bomb.style.top);

    // Function to create and style explosion elements
    function createExplosion(x, y) {
        const explosion = document.createElement("div");
        explosion.className = "explosion"; // Apply CSS class for explosion styling

        // Set the position of the explosion element
        explosion.style.position = "absolute";
        explosion.style.left = x + "px";
        explosion.style.top = y + "px";

        // Append the explosion element to the document
        document.body.appendChild(explosion);
    }

    // Create explosions in horizontal (left and right) directions
    for (let i = -blastRange; i <= blastRange; i++) {
        createExplosion(bombPositionX + i * 60, bombPositionY);
    }

    // Create explosions in vertical (up and down) directions
    for (let j = -blastRange; j <= blastRange; j++) {
        createExplosion(bombPositionX, bombPositionY + j * 60);
    }

    // Set a timer to remove the explosion elements after a certain duration
    const explosionDuration = 500; // Adjust the duration as needed
    setTimeout(() => {
        const explosions = document.querySelectorAll(".explosion");
        explosions.forEach((explosion) => explosion.parentNode.removeChild(explosion));
    }, explosionDuration);
}


/* function bombExplosion(bomb, levelMap) {
    // Remove the bomb element
    bomb.parentNode.removeChild(bomb);

    // Calculate the blast range (adjust as needed)
    const blastRange = 2; // For example, a blast range of 3 tiles

    // Calculate the bomb's position within the grid
    const gridTileSize = 60; // Assuming a grid size of 60x60 pixels
    const bombPositionX = Math.floor((parseInt(bomb.style.left) + gridTileSize / 2) / gridTileSize); // Center of the tile
    const bombPositionY = Math.floor((parseInt(bomb.style.top) + gridTileSize / 2) / gridTileSize); // Center of the tile

    // Function to create and style explosion elements
    function createExplosion(x, y) {
        if (isTileAffected(x, y)) {
            const explosion = document.createElement("div");
            explosion.className = "explosion"; // Apply CSS class for explosion styling

            // Set the position of the explosion element
            explosion.style.position = "absolute";
            explosion.style.left = x * gridTileSize + "px";
            explosion.style.top = y * gridTileSize + "px";

            // Append the explosion element to the document
            document.body.appendChild(explosion);
        }
    }

    function isTileAffected(x, y) {
        if (
            x < 0 ||
            x >= levelMap[0].length ||
            y < 0 ||
            y >= levelMap.length
        ) {
            return false; // Out of bounds, not affected
        }

        const tileValue = levelMap[y][x];

        // You can specify which tiles are affected and which are not based on your map layout
        // For example, consider walls (X) as not affected and open spaces (_) as affected.
        return tileValue === "_";
    }

    // Create explosions in horizontal (left and right) directions
    for (let i = -blastRange; i <= blastRange; i++) {
        createExplosion(bombPositionX + i, bombPositionY);
    }

    // Create explosions in vertical (up and down) directions
    for (let j = -blastRange; j <= blastRange; j++) {
        createExplosion(bombPositionX, bombPositionY + j);
    }

    // Set a timer to remove the explosion elements after a certain duration
    const explosionDuration = 500; // Adjust the duration as needed
    setTimeout(() => {
        const explosions = document.querySelectorAll(".explosion");
        explosions.forEach((explosion) => explosion.parentNode.removeChild(explosion));
    }, explosionDuration);
} */
