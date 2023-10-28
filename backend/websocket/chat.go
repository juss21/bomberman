package ws

import (
	"encoding/json"
	"fmt"
)

func SendMessage(event Event, c *Client) error {
	type Request struct {
		PlayerId   int    `json:"PlayerId"`
		PlayerName string `json:"PlayerName"`
		Message    string `json:"Message"`
	}

	var payload Request
	if err := json.Unmarshal(event.Payload, &payload); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}

	fmt.Println("received this payload:", payload)

	for client := range c.client.clients {
		SendResponse(payload, "update_chatbox", client)
	}

	return nil
}

func LobbyUpdate(event Event, c *Client) error {
	fmt.Println("lobby update requested")
	return nil
}
