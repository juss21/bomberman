// https://www.youtube.com/watch?v=pKpKv9MKN-E&ab_channel=ProgrammingPercy
package ws

import (
	"encoding/json"
	"fmt"
	"log"
)

type Event struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}
type EventHandler func(event Event, c *Client) error

// event handlers
func (m *wsManager) setupEventHandlers() {
	// m.handlers["send_gamestate"] = NewGameStateu
	m.handlers["send_player_location"] = UpdatePlayerMovement
	m.handlers["request_playerid"] = NewPlayer
}
func SendResponse(responseData any, event string, c *Client) {
	fmt.Println("Sending response:", responseData, event, c)
	response, err := json.Marshal(responseData)
	if err != nil {
		log.Printf("There was an error marshalling response %v", err)
	}
	// sending data back to the client
	var responseEvent Event
	responseEvent.Type = event
	responseEvent.Payload = response
	c.egress <- responseEvent
}
