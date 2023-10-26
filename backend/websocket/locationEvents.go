package ws

import (
	"encoding/json"
	"fmt"
)

func UpdatePlayerGameState(event Event, c *Client) error {
	type Request struct {
		PlayerId  int              `json:"PlayerId"`
		GameState GameStatePlayers `json:"GameState"`
	}

	var payload Request
	if err := json.Unmarshal(event.Payload, &payload); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}

	type Response struct {
		PlayerId  int
		GameState gsPlayer
	}

	var playerGameState gsPlayer
	for _, player := range payload.GameState.Players {
		if player.ID == payload.PlayerId {
			playerGameState = player
			break
		}
	}

	NewX, NewY := GetPlayerCoords(payload.PlayerId, payload.GameState)

	playerGameState.X = NewX
	playerGameState.Y = NewY

	responsePayload := Response{
		PlayerId:  payload.PlayerId,
		GameState: playerGameState,
	}

	for client := range c.client.clients {
		if client.playerId != payload.PlayerId {
			SendResponse(responsePayload, "update_gamestate_players", client)
		}
	}
	return nil
}
