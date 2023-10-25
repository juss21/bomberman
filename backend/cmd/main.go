package main

import (
	"log"
	"os"
	"strconv"
)

func main() {
	log.Println("Starting backend server...")
	port := getPort()
	StartServer(port)
}

func getPort() string {
	serverPort := "8081" // 8081 port by default
	if len(os.Args) > 1 {
		port, err := strconv.Atoi(os.Args[1])
		if err == nil {
			serverPort = strconv.Itoa(port)
		}
	}
	return serverPort
}
