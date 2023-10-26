package ws

import (
	"encoding/json"
	"fmt"
)

func NewPlayer(event Event, c *Client) error {

	playerId := GeneratePlayerID()
	// send playerid for our bomberman game
	if playerId != -1 {
		c.playerId = playerId
		SendResponse(playerId, "playerId", c)
	} else {
		SendResponse(playerId, "max-slots", c)
	}

	return nil
}

func PlaceBomb(event Event, c *Client) error {
	type Request struct {
		PlayerId int `json:"PlayerId"`
		BombX    int `json:"BombX"`
		BombY    int `json:"BombY"`
	}

	var payload Request
	if err := json.Unmarshal(event.Payload, &payload); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}

	var response Request
	response.PlayerId = payload.PlayerId
	response.BombX = payload.BombX
	response.BombY = payload.BombY

	for client := range c.client.clients {
		if client.playerId != payload.PlayerId {
			SendResponse(response, "new_bomb", client)
		}
	}

	return nil
}

func ChangeTile(event Event, c *Client) error {
	type Request struct {
		PlayerId int `json:"PlayerId"`
		TileX    int `json:"TileX"`
		TileY    int `json:"TileY"`
	}

	var payload Request
	if err := json.Unmarshal(event.Payload, &payload); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}

	var response Request
	response.PlayerId = payload.PlayerId
	response.TileX = payload.TileX
	response.TileY = payload.TileY

	for client := range c.client.clients {
		if client.playerId != payload.PlayerId {
			SendResponse(response, "changeTile", client)
		}
	}

	return nil
}
