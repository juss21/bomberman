# bomberman-dom

### todo

- bugid:
- - KUI keegi lobbyst leaveb, kuvab teda ikka mängus (Connected = false ei rakendu? :/)
- - bomb explosion on vahest bugine (vahest läheb lolliks kui mitu tükki panna) -> EI MIDAGI KRIITILIST?

- Eludega seoses:
- - 3 mängijaga mängides, 1 pani disconnecti (refreshides lehte), keeras teistel htmli perse
- - - characterphysics.js:251 -> failed to execute "removechild" on node -> loseLife characterphysics.js:251:25
- - alivePlayers() returnib <= 1? kui kolmas kasutaja kinni paneb (close tab)
- - alivePlayers() returnib <= 1? kui üks kolmest surma saab

### About

Welcome to our bomberman game, this is a simple multiplayer game made with Javascript & Golang

#### Our game:

- only supports one active multiplayer session

#### Audit questions:

- https://github.com/01-edu/public/tree/master/subjects/bomberman-dom/audit

### useful links:

https://bomberman.olari.dev/
https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking
https://www.gabrielgambetta.com/client-server-game-architecture.html
https://en.wikipedia.org/wiki/Netcode

### Authors:

juss & kasepuu & alavrone & andreiRedi & laagusra
