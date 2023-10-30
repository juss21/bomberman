# bomberman-dom

### todo

- > lobby

  - kui keegi leave paneb siis muuta ta "Connected" status -> "notConnected"
  - lobbyga saab joinida kui mäng käib => ära keelata (gameInProgess) boolean on tehtud, mis tuleks pm lihtsalt true ja falseks sättida

- > game
- kui mäng algab, kuvada ainult playereid kes websocketiga ühendatud on(mängijad kes mängus on), teistele remove või hidden!

- > end scene
- kui võidad/kaotad visata tagasi main menu / teha resa location.reset() vms, võidu puhul võiks visata mingi popup "palju õnne" vms

- > bugid
- firefoxis liikumine katki?

- > singleplayer
- üldse eemaldada või siis panna tühi kaart (mängijateta) renderdama

### About

Welcome to our bomberman game, this is a simple multiplayer game written in Javascript & Golang

#### Our game:

- only supports one active multiplayer game

#### Audit questions:

- https://github.com/01-edu/public/tree/master/subjects/bomberman-dom/audit

### useful links:

https://bomberman.olari.dev/
https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking
https://www.gabrielgambetta.com/client-server-game-architecture.html
https://en.wikipedia.org/wiki/Netcode

### Authors:

juss & kasepuu & alavrone & andreiRedi & laagusra
