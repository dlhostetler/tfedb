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

func registerSearch(index Index) {
	http.HandleFunc("/search", func(response http.ResponseWriter, request *http.Request) {
		query, ok := RequiredParamString(request, "q")
		if !ok {
			http.Error(response, "Missing required param 'q'.", http.StatusBadRequest)
			return
		}
		size, ok := RequiredParamInt(request, "size")
		if !ok {
			size = 100
		}

		results, err := index.Search(query, size)
		if err != nil {
			http.Error(response, err.Error(), http.StatusInternalServerError)
			return
		}

		JsonResponse(response, results, ParamPassed(request, "pretty"))
	})
}

func initHttp(db Db, index Index) {
	registerGraphiql()
	registerGraphql(db)
	registerSearch(index)
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
	client, err := NewEsClient()
	if err != nil {
		panic(client)
	}

	db := NewEsDb(client)
	index := NewEsIndex(client)

	initHttp(db, index)
	startHttp()
}
