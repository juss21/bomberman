# bomberman-dom

### About
Welcome to our bomberman game, this is a simple multiplayer game made with Javascript & Golang.
The objective of this game is to kill other players with your explosions. 

You can walk with the Arrowkeys or WASD and plant bombs with spacebar.
Bombs detonate within 2 seconds. Make sure to run away or hide behind a wall!

Destroying boxes with your explosions has a chance to drop upgrades, such as: 

<img src="https://01.kood.tech/git/kasepuu/bomberman-dom/raw/branch/master/frontend/src/game/sprites/level01/blast.png" style="width:30px; height:30px"/> - Bigger Explosion range

<img src="https://01.kood.tech/git/kasepuu/bomberman-dom/raw/branch/master/frontend/src/game/sprites/level01/bomb.png" style="width:30px; height:30px"/> - Extra bomb

<img src="https://01.kood.tech/git/kasepuu/bomberman-dom/raw/branch/master/frontend/src/game/sprites/level01/speed.png" style="width:30px; height:30px"/> - Extra movement speed (capped out at 3 boots)

Every Player has 3 lives. If you walk in to the explosion tile or stay in your bomb range, you will lose a life. 

<img src="https://01.kood.tech/git/kasepuu/bomberman-dom/raw/branch/master/frontend/src/game/sprites/level01/explosion.png" style="width:30px; height:30px"/> - Explosion tile

#### Our game:
- only supports one active multiplayer session

#### Good to know:
- since we heavily rely on localstorage, for testing you cannot use the same browser
- - you'll need at least 2 different browsers (+incognito)
- If you are encountering any issues or have any ideas, feel free to let us know

#### Audit questions:
- https://github.com/01-edu/public/tree/master/subjects/bomberman-dom/audit

### recommended links:
```
- https://bomberman.olari.dev/
- https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking
- https://www.gabrielgambetta.com/client-server-game-architecture.html
- https://en.wikipedia.org/wiki/Netcode
```

### Authors:

juss & kasepuu & alavrone & andreiRedi & laagusra
