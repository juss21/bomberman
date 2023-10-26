package ws

import (
	"encoding/json"
	"fmt"
)

func UpdatePlayerMovement(event Event, c *Client) error {
	type Request struct {
		PlayerId  int              `json:"PlayerId"`
		GameState GameStatePlayers `json:"GameState"`
	}

	var payload Request
	if err := json.Unmarshal(event.Payload, &payload); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}

	// fmt.Println("userid:", payload.PlayerId, "gamestate:", payload.GameState)

	type Response struct {
		PlayerId   int
		PlayerNewX int
		PlayerNewY int
	}

	NewX, NewY := GetPlayerCoords(payload.PlayerId, payload.GameState)

	responsePayload := Response{
		PlayerId:   payload.PlayerId,
		PlayerNewX: NewX,
		PlayerNewY: NewY,
	}
	for client := range c.client.clients {
		if client.playerId != payload.PlayerId {
			SendResponse(responsePayload, "update_gamestate_players", client)
		}
	}
	return nil
}
