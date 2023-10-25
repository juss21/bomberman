package main

import (
	"fmt"
	"log"
	"net/http"

	ws "01.kood.tech/git/kasepuu/bomberman-dom/backend/websocket"
)

type CorsHandler struct {
	*http.ServeMux
}

func (c CorsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// The CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8080") // origin
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")   // methods
	w.Header().Set("Access-Control-Allow-Headers", "*")                    // headers
	w.Header().Set("Access-Control-Allow-Credentials", "true")             // cookies
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	c.ServeMux.ServeHTTP(w, r)
}

func StartServer(port string) {
	wsManager := ws.NewManager()

	log.Printf("Starting server at port " + port + "\n\n")

	mux := http.NewServeMux()
	corsMux := &CorsHandler{ServeMux: mux}

	corsMux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("ws connection attempt:")
		http.HandlerFunc(wsManager.ServeWs).ServeHTTP(w, r)
	})

	log.Printf("backend is running at: http://localhost:" + port + "/\n")
	log.Printf("frontend should be running at: http://localhost:" + "8080" + "/\n")

	errorHandler(http.ListenAndServe(":"+port, corsMux))
}

func errorHandler(err error) {
	if err != nil {
		log.Println(err)
		return
	}
}
