// https://www.youtube.com/watch?v=pKpKv9MKN-E&ab_channel=ProgrammingPercy
package ws

import (
	"encoding/json"
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
	m.handlers["request_map"] = GenerateMap
	m.handlers["send_gamestate_upgrade"] = UpdatePlayerGameState

	m.handlers["request_playerid"] = NewPlayer

	/*lobby events*/
	m.handlers["update_lobby"] = LobbyUpdate
	m.handlers["send_message"] = SendMessage

	/*other events*/
	m.handlers["bomb_placed"] = PlaceBomb
	m.handlers["request_changeTile"] = ChangeTile
}
func SendResponse(responseData any, event string, c *Client) {
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
