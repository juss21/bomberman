package ws

type GameStatePlayers struct {
	Players []gsPlayer `json:"players"`
}

type gsPlayer struct {
	ID         int // playerid
	X          int // player-X coord
	Y          int // player-Y coord
	Lives      int // player-lives
	Bombs      int // amount of bombs player can place
	Speed      int // player speed
	BlastRange int // bomb explosion radius
	Invincible bool
	Connected  bool // player connected status
}
