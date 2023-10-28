# bomberman-dom

### todo

- > elud

  - kui oled plahvatamise hetkel pommi sees siis -1 elu ei saa
  - praegu teistele ei saa dmg teha pommiga
  - kui keegi elu kaotab uuendada websocketiga
  - damage hitbox on veider

- > lobby

  - muuda/uuenda player1-2-3-4 slotte, kui kohad on täis muuta (notConnected -> Connected) ja (lobby-slot-X.innerhtml=playername)
  - countdown timer vastavalt palju inimesi on lobbys 1: (sina ainult) waitTime 6000 vms, 2-3: countDown 30 sek, 4: countdown <=10
  - counter uuendama iga 10 sek tagant kui counter <= 10 siis iga sekund
  - countdown teha backendis hoopis?

- > overlay

  - ilmselt teiste mängijate elud ei uuendu
  - kui player sureb siis panna ta containerile filter blur vms?

- > Movement

  - tuleks transformi tagasi toppida asjad, (ainult movement?) -> Are layers being promoted properly? audit küsimus
  - või siis lihtsalt math.round speedile panna?

- > muu:
  - asjade ülese korjamine veits bugine, eriti suure movement speediga (kõnnid mööda == saad powerupi pmst)

#### Audit questions:

- https://github.com/01-edu/public/tree/master/subjects/bomberman-dom/audit

### useful links:

https://bomberman.olari.dev/
https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking
https://www.gabrielgambetta.com/client-server-game-architecture.html
https://en.wikipedia.org/wiki/Netcode

### Authors:

juss & kasepuu & alavrone & andreiRedi & laagusra
