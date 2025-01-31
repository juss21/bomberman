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
	m.handlers["update_lobby"] = LobbyUpdate
	m.handlers["send_message"] = SendMessage
	m.handlers["send-countdown-sync"] = RequestCountDownTimerSync
	m.handlers["reset-countdown"] = RequestCountDownTimerReset

	/*other events*/
	m.handlers["bomb_placed"] = PlaceBomb
	m.handlers["request_changeTile"] = ChangeTile
	m.handlers["game_started"] = GameStarted
	m.handlers["game_ended"] = GameEnded
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

func LostConnection(PlayerId int, c *Client) {

	type Response struct {
		PlayerId   int
		PlayerName string
	}
	var resp Response

	resp.PlayerId = PlayerId
	resp.PlayerName = c.playerName
	ResetGame()

	for client := range c.client.clients {
		SendResponse(resp, "connection-lost", client)
	}

}
