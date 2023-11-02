import {
  createElement,
  append,
  addEventListenerToElement,
} from "../../dist/framework.js";
import { sendChatMessage } from "./chat.js";
import { StartGame } from "./game.js";
import { gameState } from "./gameState.js";

function playerInfoHTMLStructure(app) {
  const parentId = app.id;
  const playerId = parseInt(parentId.split("-")[1]);
  const className = "playerInfoBox";

  const child = createElement("div", {
    id: `playerInfoContainer-${playerId}`,
    class: className,
    style: "filter: blur(5px)",
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

  append(app, child);
}

export function gameMenu(app) {
  if (!document.getElementById("playground")) {
    const game = createElement("div", {
      class: "playground",
      id: "playground",
    });
    append(app, game);
  }
  const playground = document.getElementById("playground");

  // should be renamed into sidebar or smth
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
    const lives = createElement("div", {
      id: "lives",
      innerHTML: `Lives: 3`,
    });
    append(infoBox, lives);

    append(overlay, infoBox);

    const playersInfo = createElement("div", {
      id: "",
      class: "overlay_all_players",
    });

    const playerInfo1 = createElement("div", {
      id: "playerInfo-1",
      class: "overlay_playerInfo",
    });
    append(playersInfo, playerInfo1);
    playerInfoHTMLStructure(playerInfo1);

    const playerInfo2 = createElement("div", {
      id: "playerInfo-2",
      class: "overlay_playerInfo",
    });
    append(playersInfo, playerInfo2);
    playerInfoHTMLStructure(playerInfo2);

    const playerInfo3 = createElement("div", {
      id: "playerInfo-3",
      class: "overlay_playerInfo",
    });
    append(playersInfo, playerInfo3);
    playerInfoHTMLStructure(playerInfo3);

    const playerInfo4 = createElement("div", {
      id: "playerInfo-4",
      class: "overlay_playerInfo",
    });
    append(playersInfo, playerInfo4);
    playerInfoHTMLStructure(playerInfo4);

    append(overlay, playersInfo);
  }

  // main playground
  if (!document.getElementById("game")) {
    const gameArena = createElement("div", { class: "playArea", id: "game" });
    append(playground, gameArena);
  }

  // display menu
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
      innerHTML: "Join lobby", //"Multiplayer",
      class: "menuButton",
    });

    let multiplayerName = createElement("input", {
      id: "nameInput",
      type: "text",
      required: true,
    });

    // append(menuButtons, button1);
    append(menuButtons, button2);

    append(menuButtons, multiplayerName);
    append(menu, menuButtons);

    addEventListenerToElement(button1, "click", () => {
      console.log("game started!");
      StartGame(true); // start the singleplayer instance! //disabled for now :O
    });
    addEventListenerToElement(button2, "click", () => {
      const enteredName = multiplayerName.value.trim(); // trim name, to make sure its not empty
      if (enteredName) {
        console.log("joining lobby!");
        StartGame(false, enteredName); // joining multiplayer lobby!
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
  const lobbyCountDown = createElement("div", {
    id: "lobbyCountDown",
    class: "lobbyCountDown",
    innerHTML: "Waiting for more people, to start the game!",
  });
  const lobbyChatContainer = createElement("div", {
    class: "lobbyChatContainer",
  });

  append(lobbyContainer, lobbyCountDown);

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
    id: "chat-log",
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

  addEventListenerToElement(chatInputBox, "keypress", (e) => {
    sendChatMessage(chatInputBox, e);
  });

  append(lobbyContainer, lobbyChatContainer);

  append(parent, lobbyContainer);
}

export function createGameHTML() {
  const gameArea = document.getElementById("game");

  if (!document.getElementById("tileMap")) {
    const tileMap = createElement("div", { class: "tileMap", id: "tileMap" });
    append(gameArea, tileMap);
  }

  if (!document.getElementById("players")) {
    const playersDiv = createElement("div", { id: "players" });
    append(gameArea, playersDiv);
  }
}

export function addChatMessage(message, fromId, fromName) {
  const parent = document.getElementById("chat-log");

  const chat = createElement("div", {
    class: `playerId-${fromId}`,
    innerHTML: `${fromName} : ${message}`,
  });

  append(parent, chat);
}

export function toggleMenuHide(forceHidden = false) {
  const element = document.getElementById("menu");

  if (element.hidden && !forceHidden) {
    element.hidden = false;
  } else {
    element.hidden = true;
  }
}

export function outcomeScreen(app, type = "win") {
  console.log("rendering win");

  app.innerHTML = "";

  const playGround = createElement("div", {
    class: "playground",
    id: "playground",
  });
  append(app, playGround);

  const overlayTemplate = createElement("div", { id: "overlay" });
  append(playGround, overlayTemplate);

  const playareaTemplate = createElement("div", {
    class: "playArea",
    id: "game",
  });
  append(playGround, playareaTemplate);

  const menu = createElement("div", { class: "gameMenu", id: "menu" });

  const menuBtns = createElement("div", { class: "menuButtons" });
  const mainMenuButton = createElement("button", {
    innerHTML: "Return to the main menu!",
    class: "menuButton",
  });
  addEventListenerToElement(mainMenuButton, "click", () => {
    window.location.href = "/";
    // location.reload(); // refresh page
  });

  append(menuBtns, mainMenuButton);

  const message =
    type === "win"
      ? `You won the game, congratulations!`
      : "You Died... Better luck next time!";
  const MessageElement = createElement("div", {
    class: "lobbyCountDown",
    innerHTML: message,
  });
  append(menuBtns, MessageElement);
  append(menu, menuBtns);
  append(playGround, menu);
}
