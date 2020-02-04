package main

import (
	"github.com/friendsofgo/graphiql"
	"github.com/graphql-go/handler"
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"
)

func registerGraphql(db Db) {
	schema, err := InitSchema(db)
	if err != nil {
		panic(err)
	}

	h := handler.New(&handler.Config{
		Schema:   &schema,
		Pretty:   true,
		GraphiQL: true,
	})

	http.Handle("/graphql", h)
}

func registerGraphiql() {
	graphiqlHandler, err := graphiql.NewGraphiqlHandler("/graphql")
	if err != nil {
		panic(err)
	}
	http.Handle("/", graphiqlHandler)
}

func initHttp(db Db) {
	registerGraphiql()
	registerGraphql(db)
}

func startHttp() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Printf("Defaulting to port %s", port)
	}

	log.Printf("Listening on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}

func main() {
	rand.Seed(time.Now().UTC().UnixNano())

	db, err := NewEsDb()
	if err != nil {
		panic(err)
	}

	initHttp(db)
	startHttp()
}
