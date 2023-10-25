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
	m.handlers["on_connection"] = OnConnectionHandler
}
func sendResponse(responseData any, event string, c *Client) {
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
func OnConnectionHandler(event Event, c *Client) error {
	type Requester struct {
		RequesterID int `JSON:"RequesterID"`
	}
	var payload Requester
	if err := json.Unmarshal(event.Payload, &payload); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}
	RequesterID := payload.RequesterID
	for client := range c.client.clients {
		if client.userId == RequesterID {
			UpdateRequestsAndNotifications(RequesterID, client)
		}
	}
	return nil
}

// function that responds updated notifications etc...
func UpdateRequestsAndNotifications(UserID int, client *Client) {
	fmt.Println("New connection!")
}
