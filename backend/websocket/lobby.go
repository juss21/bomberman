package ws

import (
	"encoding/json"
	"fmt"
)

var waitTime = 60   // Default wait time (in seconds)
var waitTime2p = 20 // wait time when 2 players connected
var waitTime4p = 10 // wait time when 4 players connected

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

	for client := range c.client.clients {
		SendResponse(payload, "update_chatbox", client)
	}

	return nil
}

func LobbyJoin(event Event, c *Client) error {
	if gameInProgress {
		errorMessage := "There is game already ongoing. Please wait."
		ResetGame() // check whether game could be reset
		SendResponse(errorMessage, "lobby-full", c)
		c.client.removeClient(c)
		return fmt.Errorf("game ongoing")
	}

	type Request struct {
		PlayerName string `json:"PlayerName"`
	}

	var payload Request
	if err := json.Unmarshal(event.Payload, &payload); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}

	playerId := GeneratePlayerID()
	currentLevel, err := GenerateMap()
	if err != nil {
		return fmt.Errorf("bad map generation: %v", err)
	}

	type Response struct {
		PlayerId     int
		CurrentLevel LevelMap
	}

	var resp Response
	resp.PlayerId = playerId
	resp.CurrentLevel = currentLevel

	// send playerid for our bomberman game
	if playerId != -1 {
		c.playerId = playerId
		c.playerName = payload.PlayerName
		SendResponse(resp, "lobby-joined", c)
	}

	for client := range c.client.clients {
		if client.playerId != resp.PlayerId {
			SendResponse("", "request-countdown-sync", client)
		}
	}

	return nil
}

/*lobby wait*/

func LobbyTimerUpdate(event Event, c *Client) error {
	type Request struct {
		PlayerId int `json:"PlayerId"`
		WaitTime int `json:"WaitTime"`
	}

	var payload Request
	if err := json.Unmarshal(event.Payload, &payload); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}

	waitTime = payload.WaitTime

	LobbyUpdate(event, c)

	return nil
}

func LobbyUpdate(event Event, c *Client) error {
	type Request struct {
		PlayerId int `json:"PlayerId"`
	}

	var payload Request
	if err := json.Unmarshal(event.Payload, &payload); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}

	type ResponsePlayer struct {
		PlayerId   int
		PlayerName string
	}

	type Response struct {
		Players  []ResponsePlayer
		TimeLeft int
	}
	var resp Response

	// counting all the clients connected to our system
	for client := range c.client.clients {
		player := ResponsePlayer{
			PlayerId:   client.playerId,
			PlayerName: client.playerName,
		}
		resp.Players = append(resp.Players, player)
	}

	resp.TimeLeft, _ = LobbyStartCountdown(len(resp.Players))
	// send back all connected users?
	for client := range c.client.clients {
		SendResponse(resp, "lobby-update", client)
		SendResponse(resp, "lobby-countdown", client) // sync up countdown timer
	}

	return nil
}

func LobbyStartCountdown(PlayerCount int) (int, error) {
	if (PlayerCount == 2 || PlayerCount == 3) && waitTime > 30 {
		waitTime = waitTime2p
	} else if PlayerCount == 4 && waitTime > 10 {
		waitTime = waitTime4p
	} else if PlayerCount == 1 || PlayerCount == 0 {
		waitTime = 10000
	}

	return waitTime, nil
}

func RequestCountDownTimerSync(event Event, c *Client) error {
	type Request struct {
		NewTime int `json:"NewTime"`
	}

	var payload Request
	if err := json.Unmarshal(event.Payload, &payload); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}

	waitTime = payload.NewTime
	return nil
}

func RequestCountDownTimerReset(event Event, c *Client) error {
	type Request struct {
		WaitTime int `json:"WaitTime"`
	}

	var payload Request
	if err := json.Unmarshal(event.Payload, &payload); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}

	type ResponsePlayer struct {
		PlayerId   int
		PlayerName string
	}

	type Response struct {
		Players  []ResponsePlayer
		TimeLeft int
	}
	var resp Response

	// counting all the clients connected to our system
	for client := range c.client.clients {
		player := ResponsePlayer{
			PlayerId:   client.playerId,
			PlayerName: client.playerName,
		}
		resp.Players = append(resp.Players, player)
	}

	countDown, err := LobbyStartCountdown(len(resp.Players))

	waitTime = countDown
	resp.TimeLeft = waitTime

	for client := range c.client.clients {
		SendResponse(resp, "lobby-update", client)
		SendResponse(resp, "lobby-countdown", client) // sync up countdown timer
	}

	return err
}
