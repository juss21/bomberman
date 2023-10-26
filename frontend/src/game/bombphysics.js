import { changeTile, tileSize, addRandomPowerUp, characterSize } from "./board.js";
import { levelMaps } from "./maps/mapBuilder.js";
import { playerData } from "./game.js";
import { loseLife } from "./game.js";
import { gameState } from "./gameState.js";


export let canMoveThroughBomb = false;
const bombTimers = {};

export function setCanMoveThroughBomb(value) {
    canMoveThroughBomb = value;
}

function createExplosion(x, y, currentTile) {
    const xTile = x / tileSize
    const yTile = (y / tileSize) - 1
    changeTile(xTile, yTile, "explosion")
    let characterTileX1 = Math.floor((gameState.players[0].x) / tileSize);
    let characterTileY1 = Math.floor((gameState.players[0].y) / tileSize);
    let characterTileX2 = Math.floor((gameState.players[0].x + characterSize) / tileSize);
    let characterTileY2 = Math.floor((gameState.players[0].y + characterSize) / tileSize);

    if ((characterTileX1 === xTile && characterTileY1 === yTile) || (characterTileX2 === xTile && characterTileY2  === yTile)) {
        loseLife();
    }

    // Set a timer to remove the explosion elements after a certain duration
    const explosionDuration = 500;
    setTimeout(() => {
        let newTile;
        if (currentTile === "b") newTile = addRandomPowerUp();
        else newTile = "_";
        changeTile(xTile, yTile, newTile)
    }, explosionDuration);

    if (bombTimers[xTile] && bombTimers[xTile][yTile]) {
        clearTimeout(bombTimers[xTile][yTile]);
        delete bombTimers[xTile][yTile];
    }
}

function explosionCollision(x, y) {
    let explosionTileX1 = x / tileSize;
    let explosionTileY1 = (y / tileSize) - 1;
    let currentTile = levelMaps[0][0][explosionTileY1][explosionTileX1];
    if (currentTile === "!") {
        bombExplosion(x, y, explosionTileX1, explosionTileY1)
    }
    if (currentTile === "b") {
        createExplosion(x, y, currentTile);
        return false
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

export function plantBomb(player) {
    const playerRect = player.getBoundingClientRect();
    const playerLeft = playerRect.left;
    const playerTop = playerRect.top;

    canMoveThroughBomb = true

    const bombPositionX = Math.round(playerLeft / tileSize) * tileSize;
    const bombPositionY = Math.round(playerTop / tileSize) * tileSize;

    let explosionTileY = (bombPositionY / tileSize) - 1;
    let explosionTileX = (bombPositionX / tileSize);

    let currentTile = levelMaps[0][0][explosionTileY][explosionTileX]
    if (currentTile !== "explosion" && currentTile !== "!") {
        playerData.bombs -= 1;
        changeTile(explosionTileX, explosionTileY, "!")
        createBombTimer(explosionTileX, explosionTileY);
    }
}

function createBombTimer(x, y) {
    // Create a timer for the bomb at location x, y
    const bombExplodeDelay = 2000;
    bombTimers[x] = bombTimers[x] || {};
    bombTimers[x][y] = setTimeout(() => {
        bombExplosion(x * tileSize, (y + 1) * tileSize, x, y);
    }, bombExplodeDelay);
}

function bombExplosion(bombPositionX, bombPositionY, explosionTileX, explosionTileY) {
    playerData.bombs += 1;
    changeTile(explosionTileX, explosionTileY, "_")
    createExplosion(bombPositionX, bombPositionY);
    const directions = [
        [1, 0], [-1, 0], [0, 1], [0, -1] // Right, Left, Down, Up
    ];

    for (const [dx, dy] of directions) {
        let x = bombPositionX;
        let y = bombPositionY;

        for (let i = 0; i < playerData.blastRange; i++) {
            x += dx * tileSize;
            y += dy * tileSize;

            if (!explosionCollision(x, y)) {
                break;
            }
            createExplosion(x, y);
        }
    }
}
