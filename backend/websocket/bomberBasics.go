package ws

import (
	"log"
)

/*for player id generation*/
type Player struct {
	ID    int
	Taken bool
}

var Players []Player

func CreatePlayers() {
	Players = append(Players, Player{ID: 1, Taken: false})
	Players = append(Players, Player{ID: 2, Taken: false})
	Players = append(Players, Player{ID: 3, Taken: false})
	Players = append(Players, Player{ID: 4, Taken: false})
}

func GeneratePlayerID() int {

	for i := range Players {
		if Players[i].Taken {
			continue
		}
		Players[i].Taken = true
		return Players[i].ID
	}

	return -1
}

func RemovePlayer(ID int) {
	for i := range Players {
		if Players[i].ID == ID {
			Players[i].Taken = false
			return
		}
	}
}

func ResetGame() {
	PlayerCount := 0
	for i := range Players {
		if Players[i].Taken {
			PlayerCount++
		}
	}

	if PlayerCount == 0 || PlayerCount == 1 {
		log.Println("[Game] Lobby countdown has been reset:", PlayerCount)
		waitTime = 60
		gameInProgress = false
		ResetMap()
	}
}

/*other*/
func GetPlayerCoords(playerId int, gameState GameStatePlayers) (X int, Y int) {
	for i := 0; i < len(gameState.Players); i++ {
		if gameState.Players[i].ID == playerId {
			X = gameState.Players[i].X
			Y = gameState.Players[i].Y
		}
	}

	return X, Y
}
