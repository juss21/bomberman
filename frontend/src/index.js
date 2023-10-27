import {
  createElement,
  append,
  State,
  loadCSS,
  Event,
  addEventListener,
  Router,
  addEventListenerToElement,
} from "../dist/framework.js";
import { StartGame } from "./game/game.js";

loadCSS("./src/index.css");

localStorage.clear(); // clear localStorage

const app = document.getElementById("app");
export const backendHost = `localhost:8081`;

export let frameCapping = 0;
export const setFrameCapping = (value) => {
  frameCapping = value;
};

function render() {
  // console.log("building maps");
  // buildMaps();

  gameMenu(app);
}

function gameMenu(parent) {
  if (!document.getElementById("playground")) {
    const game = createElement("div", {
      class: "playground",
      id: "playground",
    });
    append(parent, game);
  }
  const playground = document.getElementById("playground");

  if (!document.getElementById("overlay")) {
    const overlay = createElement("div", { id: "overlay" });
    append(playground, overlay);

    const infoBox = createElement("div", { id: "info", class: "overlay_info" });

    // create fps counter
    const fpsCounter = createElement("div", { id: "fps" });
    append(infoBox, fpsCounter);

    // create player_name info
    const infoPlayerName = createElement("div", { id: "your_name" });
    append(infoBox, infoPlayerName);

    // create player_playing_as info
    const infoPlayingAs = createElement("div", { id: "playing_as" });
    append(infoBox, infoPlayingAs);

    // create player_lives info
    const lives = createElement("div", { id: "lives", innerHTML: `Lives: 3` });
    append(infoBox, lives);

    append(overlay, infoBox);

    function playerInfoStructure(parent) {
      const parentId = parent.id;
      const playerId = parseInt(parentId.split("-")[1]);
      const className = "playerInfoBox";

      const child = createElement("div", {
        id: `playerInfoContainer-${playerId}`,
        class: className,
      });

      const name = createElement("div", {
        id: `name-${playerId}`,
        className: `${className}-name`,
        innerHTML: "player-name",
      });
      append(child, name);

      const lives = createElement("div", {
        id: `lives-${playerId}`,
        className: `${className}-lives`,
        innerHTML: "Lives: 3",
      });
      append(child, lives);

      const image = createElement("img", {
        id: `PlayerImg-${playerId}`,
        width: "100px",
        height: "100px",
        className: "alive",
      });
      append(child, image);

      append(parent, child);
    }

    const playersInfo = createElement("div", {
      id: "",
      class: "overlay_all_players",
    });

    const playerInfo1 = createElement("div", {
      id: "playerInfo-1",
      class: "overlay_playerInfo",
    });
    append(playersInfo, playerInfo1);
    playerInfoStructure(playerInfo1);

    const playerInfo2 = createElement("div", {
      id: "playerInfo-2",
      class: "overlay_playerInfo",
    });
    append(playersInfo, playerInfo2);
    playerInfoStructure(playerInfo2);

    const playerInfo3 = createElement("div", {
      id: "playerInfo-3",
      class: "overlay_playerInfo",
    });
    append(playersInfo, playerInfo3);
    playerInfoStructure(playerInfo3);

    const playerInfo4 = createElement("div", {
      id: "playerInfo-4",
      class: "overlay_playerInfo",
    });
    append(playersInfo, playerInfo4);
    playerInfoStructure(playerInfo4);

    append(overlay, playersInfo);
  }

  if (!document.getElementById("game")) {
    const gameArena = createElement("div", { class: "playArea", id: "game" });
    append(playground, gameArena);
  }

  menuHtml();
}

function menuHtml() {
  const playground = document.getElementById("playground");

  if (!document.getElementById("menu")) {
    const menu = createElement("div", { class: "gameMenu", id: "menu" });
    const menuButtons = createElement("div", { class: "menuButtons" });

    let button1 = createElement("button", {
      innerHTML: "Singleplayer",
      class: "menuButton",
    });

    let button2 = createElement("button", {
      innerHTML: "Multiplayer",
      class: "menuButton",
    });

    let multiplayerName = createElement("input", {
      id: "nameInput",
      type: "text",
      value: "test",
      required: true,
    });

    append(menuButtons, button1);
    append(menuButtons, multiplayerName);
    append(menuButtons, button2);
    append(menu, menuButtons);

    addEventListenerToElement(button1, "click", () => {
      console.log("game started!");
      StartGame(true);
    });
    addEventListenerToElement(button2, "click", () => {
      const enteredName = multiplayerName.value.trim(); // Get the value of the input field and remove leading/trailing spaces
      if (enteredName) {
        console.log("joined lobby!");
        StartGame(false, enteredName);
      } else {
        alert("Please enter a valid name, before joining multiplayer!");
        console.log("Please enter a valid name!");
      }
    });

    append(playground, menu);
  }
}

export function lobbyMenu() {
  const parent = document.getElementById("menu");

  parent.innerHTML = "";

  const lobbyContainer = createElement("div", { class: "lobbyContainer" });
  const lobbyPlayersContainer = createElement("div", {
    class: "lobbyPlayers",
  });
  const lobbyChatContainer = createElement("div", {
    class: "lobbyChatContainer",
  });

  append(lobbyContainer, lobbyPlayersContainer);

  const player1Slot = createElement("div", {
    class: "lobbyPlayer notConnected",
    id: `Player-1`,
  });
  append(lobbyPlayersContainer, player1Slot);
  const player1Name = createElement("h1", {
    class: "lobbyPlayerName",
    id: "lobby-slot-1",
  });
  append(player1Slot, player1Name);

  const player2Slot = createElement("div", {
    class: "lobbyPlayer notConnected",
    id: `Player-2`,
  });
  append(lobbyPlayersContainer, player2Slot);
  const player2Name = createElement("h1", {
    class: "lobbyPlayerName",
    id: "lobby-slot-2",
  });
  append(player2Slot, player2Name);

  const player3Slot = createElement("div", {
    class: "lobbyPlayer notConnected",
    id: `Player-3`,
  });
  append(lobbyPlayersContainer, player3Slot);
  const player3Name = createElement("h1", {
    class: "lobbyPlayerName",
    id: "lobby-slot-3",
  });
  append(player3Slot, player3Name);

  const player4Slot = createElement("div", {
    class: "lobbyPlayer notConnected",
    id: `Player-4`,
  });
  append(lobbyPlayersContainer, player4Slot);
  const player4Name = createElement("h1", {
    class: "lobbyPlayerName",
    id: "lobby-slot-4",
  });
  append(player4Slot, player4Name);

  const chatLog = createElement("div", {
    class: "chat-log",
  });
  append(lobbyChatContainer, chatLog);

  const chatLogMessage = createElement("div", {
    class: "chat-log-message",
  });

  append(lobbyChatContainer, chatLogMessage);

  const chatInputBox = createElement("input", {
    type: "text",
    class: "chat-input",
  });
  append(lobbyChatContainer, chatInputBox);

  append(lobbyContainer, lobbyChatContainer);

  append(parent, lobbyContainer);
  // menuHtml()
}

// Initial rendering
/* ROUTING */
const routes = {
  "/": () => {
    render();
  },
};

const routerInstance = new Router(routes);

// Listen for changes in the todoState and re-render when the state changes
