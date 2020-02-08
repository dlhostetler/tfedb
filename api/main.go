package main

import (
	log "github.com/sirupsen/logrus"
	"math/rand"
	"time"
)

func initLog() {
	log.SetFormatter(&log.TextFormatter{
		ForceColors: IsWindows(),
	})
}

func initEs() (Db, Index) {
	client, err := NewEsClient()
	if err != nil {
		panic(client)
	}

	return NewEsDb(client), NewEsIndex(client)
}

func main() {
	initLog()
	log.Info("Starting tfedb api.")
	rand.Seed(time.Now().UTC().UnixNano())

	db, index := initEs()
	handler, err := InitHttp(db, index)
	if err != nil {
		panic(err)
	}
	StartHttp(handler)
}
