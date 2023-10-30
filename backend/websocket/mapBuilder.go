package ws

import (
	"fmt"
	"math/rand"
	"os"
	"strings"
	"time"
)

type LevelMap struct {
	Map [][]string `json:"map"`
}

var levelMap LevelMap

func RandomizeMap(level LevelMap) LevelMap {
	rand.Seed(time.Now().UnixNano()) // Seed the random number generator with current time

	modifiedMap := LevelMap{
		Map: make([][]string, len(level.Map)),
	}

	for i := 0; i < len(level.Map); i++ {
		modifiedMap.Map[i] = make([]string, len(level.Map[i]))
		copy(modifiedMap.Map[i], level.Map[i])
	}

	for i := 0; i < len(level.Map); i++ {
		for j := 0; j < len(level.Map[i]); j++ {
			elem := level.Map[i][j]
			if elem == "b" && rand.Float64() < 0.1 {
				modifiedMap.Map[i][j] = "_"
			} else if elem == "b" && rand.Float64() < 0.2 {
				modifiedMap.Map[i][j] = "j"
			} else if elem == "b" && rand.Float64() < 0.2 {
				modifiedMap.Map[i][j] = "l"
			} else if elem == "b" && rand.Float64() < 0.2 {
				modifiedMap.Map[i][j] = "p"
			} else if elem == "O" {
				modifiedMap.Map[i][j] = "b"
			}

			/*legend*/
			// j => jordanid
			// l => lightning++
			// p => pomm
			// O => must have boxes
		}
	}

	return modifiedMap
}

func ReadMapFile(mapName string) (LevelMap, error) {
	// a map has already been created
	if levelMap.Map != nil {
		return levelMap, nil
	}
	fmt.Println("levelmap has no data:", levelMap.Map, "generating one...")

	url := "backend/websocket/maps/" + mapName + ".txt" // tilemap_singleplayer || tilemap_multiplayer
	mapData, err := os.ReadFile(url)
	if err != nil {
		return levelMap, err
	}

	lines := strings.Split(string(mapData), "\n")

	for _, line := range lines {
		levelMap.Map = append(levelMap.Map, strings.Split(line, ","))
	}

	levelMap = RandomizeMap(levelMap)

	return levelMap, nil
}

func GenerateMap() (tileMap LevelMap, err error) {

	tileMap, err = ReadMapFile("tilemap_multiplayer")
	// SendResponse(tilemap, "currentlevel", c)

	return tileMap, err
}
