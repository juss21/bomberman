package ws

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
