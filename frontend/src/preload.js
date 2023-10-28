import { append, createElement } from "../dist/framework.js";

function preloadImagesAuto(folder) {
  // this does not work anymore, for now

  const extentions = [".jpg", ".jpeg", ".png", ".gif"];

  fetch(folder)
    .then((response) => response.text())
    .then((html) => {
      let parser = new DOMParser();
      let doc = parser.parseFromString(html, "text/html");
      let images = doc.getElementsByTagName("a");

      for (let i = 0; i < images.length; i++) {
        let imageUrl = images[i].getAttribute("href");

        if (extentions.some((ext) => imageUrl.endsWith(ext))) {
          const imageLink = document.createElement("link");
          imageLink.rel = "preload";
          imageLink.href = folder + "/" + imageUrl;
          imageLink.as = "image";
          document.head.appendChild(imageLink);
        }
      }
    });
}

function preloadImage(src) {
  //    <link rel="preload" href="../images/icon.png" as="image">
  const element = createElement("link", {
    rel: "preload",
    href: src,
    as: "image",
  });

  append(document.head, element);
}

export function preload() {
  console.log("preloading:");
  // preloading image elements
  preloadImage("src/game/sprites/mainMenu.png");
  preloadImage("src/game/sprites/players/1.png");
  preloadImage("src/game/sprites/players/2.png");
  preloadImage("src/game/sprites/players/3.png");
  preloadImage("src/game/sprites/players/4.png");

  // preloading map elements
  preloadImage("src/game/sprites/level01/_.png");
  preloadImage("src/game/sprites/level01/!.png");
  preloadImage("src/game/sprites/level01/b.png");
  preloadImage("src/game/sprites/level01/blast.png");
  preloadImage("src/game/sprites/level01/bomb.png");
  preloadImage("src/game/sprites/level01/explosion.png");
  preloadImage("src/game/sprites/level01/j.png");
  preloadImage("src/game/sprites/level01/l.png");
  preloadImage("src/game/sprites/level01/p.png");
  preloadImage("src/game/sprites/level01/speed.png");
  preloadImage("src/game/sprites/level01/X.png");
}
