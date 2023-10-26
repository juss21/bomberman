package ws

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"
)

type LevelMap struct {
	Map [][]string `json:"map"`
}

var levelMap LevelMap

func RandomizeMap(level LevelMap) LevelMap {
	var modifiedMap LevelMap

	return modifiedMap
}

func ReadMapFile(mapName string, c *Client) (newMap LevelMap, err error) {
	// a map has already been created
	if levelMap.Map != nil {
		return levelMap, err
	}
	url := "/maps/" + mapName + ".txt" // tilemap_singleplayer || tilemap_multiplayer
	mapData, err := os.ReadFile(url)
	if err != nil {
		return newMap, err
	}

	lines := strings.Split(string(mapData), "\n")

	for _, line := range lines {
		levelMap.Map = append(levelMap.Map, strings.Split(line, ","))
	}

	return newMap, err
}

func GenerateMap(event Event, c *Client) error {
	type Request struct {
		PlayerId int `json:"PlayerId"`
	}

	var payload Request
	if err := json.Unmarshal(event.Payload, &payload); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}

	// if singleplayer
	if payload.PlayerId == 0 {
		tilemap, err := ReadMapFile("tilemap_singleplayer", c)
		if err != nil {
			return err
		}
		SendResponse(tilemap.Map, "currentlevel", c)
	} else {
		tilemap, err := ReadMapFile("tilemap_multiplayer", c)
		if err != nil {
			return err
		}
		SendResponse(tilemap.Map, "currentlevel", c)
	}

	return nil
}
