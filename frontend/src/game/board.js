import { append, createElement } from "../../dist/framework.js";
import { gameState } from "./gameState.js";
// 15x13 tiles (60px each)
export const tileSize = 60; // 60px
export const characterSize = 48;
const playerDisplacement = (tileSize - characterSize) / 2; // used to center the player
const boardHeigth = 12 * tileSize + playerDisplacement;

export let Player1 = { X: 0, Y: 0, ID: 1 };
export let Player2 = { X: 0, Y: 0, ID: 2 };
export let Player3 = { X: 0, Y: 0, ID: 3 };
export let Player4 = { X: 0, Y: 0, ID: 4 };

export let LevelMap = [[]];

export function setLevelMap(newMap) {
  LevelMap = newMap;
}

function resetCoords() {
  Player1.X = 0;
  Player1.Y = 0;
  Player2.X = 0;
  Player2.Y = 0;
  Player3.X = 0;
  Player3.Y = 0;
  Player4.X = 0;
  Player4.Y = 0;
}

function fetchCoordinates(map) {
  resetCoords();
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === "1") {
        Player1.X = x * tileSize + playerDisplacement;
        Player1.Y = boardHeigth - y * tileSize;
      }
      if (map[y][x] === "2") {
        Player2.X = x * tileSize + playerDisplacement;
        Player2.Y = boardHeigth - y * tileSize;
      }
      if (map[y][x] === "3") {
        Player3.X = x * tileSize + playerDisplacement;
        Player3.Y = boardHeigth - y * tileSize;
      }
      if (map[y][x] === "4") {
        Player4.X = x * tileSize + playerDisplacement;
        Player4.Y = boardHeigth - y * tileSize;
      }
    }
  }

  // for debugging
  // console.log("coordinates for player1:", Player1);
  // console.log("coordinates for player2:", Player2);
  // console.log("coordinates for player3:", Player3);
  // console.log("coordinates for player4:", Player4);
}

function createPlayer(PlayerId = 1) {
  let player;

  switch (PlayerId) {
    case 1:
      player = Player1;
      break;
    case 2:
      player = Player2;
      break;
    case 3:
      player = Player3;
      break;
    case 4:
      player = Player4;
      break;
    default:
      player = Player1;
  }

  if (player.X === 0 && player.Y === 0) return; // Skip players with invalid coordinates

  const parent = document.getElementById("players");

  const playerElement = createElement("div", {
    id: `Player-${player.ID}`,
    class: "PlayerSprite",
    style: `left:${player.X}px;top:${player.Y}px`,
  });

  append(parent, playerElement);
}

export function drawTiles(map, currentLevel = 1) {
  const boardMap = map.map;
  const parent = document.getElementById("tileMap");
  parent.innerHTML = "";

  LevelMap = boardMap;

  const mapDiv = createElement("div", { class: "tile-map", id: "tile-map" });
  fetchCoordinates(boardMap);
  for (let i = 0; i < gameState.players.length; i++) {
    if (gameState.players[i].Connected) {
      createPlayer(i + 1);
    }
  }

  for (let i = 0; i < boardMap.length; i++) {
    const mapRow = createElement("div", { class: "tile-row", id: "tile" + i });

    for (let j = 0; j < boardMap[i].length; j++) {
      let elem = boardMap[i][j];
      if (elem === "1" || elem === "2" || elem === "3" || elem === "4") {
        elem = "_";
      }
      let img = createElement("img", {
        id: "img" + j,
        src: `src/game/sprites/level0${currentLevel}/${elem}.png`,
      });
      append(mapRow, img);
    }
    append(mapDiv, mapRow);
  }
  append(parent, mapDiv);
}

export function changeTile(explosionTileX, explosionTileY, newTile) {
  const tile = document.getElementById("tile" + explosionTileY);
  const img = tile.querySelector("#img" + explosionTileX);
  img.src = `src/game/sprites/level0${1}/${newTile}.png`;
  LevelMap[explosionTileY][explosionTileX] = newTile;
}
