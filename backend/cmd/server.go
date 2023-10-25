package main

import (
	"log"
	"net/http"

	ws "01.kood.tech/git/kasepuu/bomberman-dom/backend/websocket"
)

func StartServer(port string) {
	wsManager := ws.NewManager()

	log.Printf("Starting server at port " + port + "\n\n")

	mux := http.NewServeMux()

	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		http.HandlerFunc(wsManager.ServeWs).ServeHTTP(w, r)
	})

	log.Printf("backend is running at: http://localhost:" + port + "/\n")
	log.Printf("frontend should be running at: http://localhost:" + "8080" + "/\n")

	errorHandler(http.ListenAndServe(":"+port, mux))
}

func errorHandler(err error) {
	if err != nil {
		log.Println(err)
		return
	}
}
