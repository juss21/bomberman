// https://www.youtube.com/watch?v=pKpKv9MKN-E&ab_channel=ProgrammingPercy
package ws

import (
	"encoding/json"
	"log"
)

var gameInProgress bool = false

type Event struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}
type EventHandler func(event Event, c *Client) error

// event handlers
func (m *wsManager) setupEventHandlers() {

	m.handlers["send_gamestate_upgrade"] = UpdatePlayerGameState
	m.handlers["update_lives"] = UpdateLives

	/*lobby events*/
	m.handlers["join_lobby"] = LobbyJoin
	m.handlers["leave_lobby"] = LobbyLeave
	m.handlers["update_lobby"] = LobbyUpdate
	m.handlers["send_message"] = SendMessage
	m.handlers["send-countdown-sync"] = RequestCountDownTimerSync

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
