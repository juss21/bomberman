package ws

type GameStatePlayers struct {
	Players []gsPlayer `json:"players"`
}

type gsPlayer struct {
	ID         int // playerid
	X          int // player-X coord
	Y          int // player-Y coord
	Lives      int // player-lives
	Bombs      int //amount of bombs player can place
	FlameRange int // bomb explosion radius
	Speed      int // player speed
}
