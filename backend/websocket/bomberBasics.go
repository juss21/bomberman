package ws

import "fmt"

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

	fmt.Println("Couldn't find player", ID)
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
