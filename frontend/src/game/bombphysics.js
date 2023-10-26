import {
    changeTile,
    tileSize,
    addRandomPowerUp,
    characterSize,
    LevelMap,
} from "./board.js";
import { loseLife } from "./game.js";
import { gameState } from "./gameState.js";
import { sendEvent } from "./websocket.js";

export let canMoveThroughBomb = false;
const bombTimers = {};

export function setCanMoveThroughBomb(value) {
    canMoveThroughBomb = value;
}

function createExplosion(x, y, currentTile) {
    const xTile = x / tileSize;
    const yTile = y / tileSize - 1;
    changeTile(xTile, yTile, "explosion");

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

function explosionCollision(x, y) {
    let explosionTileX1 = x / tileSize;
    let explosionTileY1 = y / tileSize - 1;
    let currentTile = LevelMap[explosionTileY1][explosionTileX1];
    if (currentTile === "!") {
        bombExplosion(x, y, explosionTileX1, explosionTileY1);
    }
    if (
        currentTile === "b" ||
        currentTile === "j" ||
        currentTile === "l" ||
        currentTile === "p"
    ) {
        createExplosion(x, y, currentTile);
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
    let explosionTileX = Math.round(playerLeft / tileSize)

    let currentTile = LevelMap[explosionTileY][explosionTileX];
    if (currentTile !== "explosion" && currentTile !== "!") {
        gameState.players[playerId - 1].bombs -= 1;
        sendEvent("bomb_placed", {
            PlayerId: playerId,
            BombX: explosionTileX,
            BombY: explosionTileY,
        });
        spawnBomb(
            playerId,
            explosionTileX,
            explosionTileY
        );
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
    gameState.players[playerId-1].bombs += 1;
    changeTile(explosionTileX, explosionTileY, "_");
    createExplosion(bombPositionX, bombPositionY);
    const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1], // Right, Left, Down, Up
    ];
    console.log("SIIN:", gameState.players[playerId-1].blastRange, "PlayerID:", playerId)
    for (const [dx, dy] of directions) {
        let x = bombPositionX;
        let y = bombPositionY;

        for (let i = 0; i < gameState.players[playerId-1].blastRange; i++) {
            x += dx * tileSize;
            y += dy * tileSize;

            if (!explosionCollision(x, y)) {
                break;
            }
            createExplosion(x, y);
        }
    }
}
