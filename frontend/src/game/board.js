import { append, createElement } from "../../dist/framework.js";
import { playerData } from "./game.js";
import { levelMaps } from "./maps/mapBuilder.js";
// 15x13 tiles (60px each)
export const tileSize = 60; // 60px
export const characterSize = 48;
const playerDisplacement = (tileSize - characterSize) / 2; // used to center the player
const boardHeigth = 12 * tileSize + playerDisplacement;

export let Player1 = { X: 0, Y: 0, ID: 1 };
export let Player2 = { X: 0, Y: 0, ID: 2 };
export let Player3 = { X: 0, Y: 0, ID: 3 };
export let Player4 = { X: 0, Y: 0, ID: 4 };

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

  console.log("coordinates for player1:", Player1);
  console.log("coordinates for player2:", Player2);
  console.log("coordinates for player3:", Player3);
  console.log("coordinates for player4:", Player4);
}

function createPlayer(Player = 1) {
  if (Player.X === 0 && Player.Y === 0) return;

  const parent = document.getElementById("players");

  const player = createElement("div", {
    id: `Player-${Player.ID}`,
    class: "PlayerSprite",
    style: `left:${Player.X}px;top:${Player.Y}px`,
  });
  append(parent, player);
}

export function drawTiles(currentLevel = 1) {
  const parent = document.getElementById("tileMap");
  parent.innerHTML = "";

  const mapDiv = createElement("div", { class: "tile-map", id: "tile-map" });

  fetchCoordinates(levelMaps[0][0]);
  createPlayer(Player1);
  createPlayer(Player2);
  createPlayer(Player3);
  createPlayer(Player4);

  for (let i = 0; i < levelMaps[0][0].length; i++) {
    const mapRow = createElement("div", { class: "tile-row", id: "tile" + i });

    for (let j = 0; j < levelMaps[0][0][i].length; j++) {
      let elem = levelMaps[0][0][i][j];
      if (elem === "1" || elem === "2" || elem === "3" || elem === "4") {
        elem = "_";
      } else if (elem === "b") {
        if (Math.random() < 0.2) {
          elem = "_"
          levelMaps[0][0][i][j] = "_"
        }
      } else if (elem === "s") {
        elem = "b"
        levelMaps[0][0][i][j] = "b"
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
  console.log(newTile)
  const tile = document.getElementById("tile" + explosionTileY);
  const img = tile.querySelector("#img" + explosionTileX);
  img.src = `src/game/sprites/level0${1}/${newTile}.png`;
  levelMaps[0][0][explosionTileY][explosionTileX] = newTile;
}

export function addRandomPowerUp() {
  let powerups = ["bomb", "blast", "speed"]
  if (Math.random() < 0.2) {
    let randomIndex = Math.floor(Math.random() * powerups.length);
    return powerups[randomIndex];
  }
  else return "_"
}
