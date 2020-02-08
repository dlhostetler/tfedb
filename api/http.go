package main

import (
	"encoding/json"
	"fmt"
	"github.com/friendsofgo/graphiql"
	"github.com/graphql-go/handler"
	"github.com/rs/cors"
	log "github.com/sirupsen/logrus"
	"net"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strconv"
	"strings"
	"syscall"
)

func requiredParamString(request *http.Request, param string) (string, bool) {
	queries, ok := request.URL.Query()[param]
	if !ok || len(queries[0]) < 1 {
		return "", false
	}
	return queries[0], true
}

func requiredParamInt(request *http.Request, param string) (int, bool) {
	s, ok := requiredParamString(request, param)
	if !ok {
		return 0, false
	}
	i, err := strconv.Atoi(s)
	if err != nil {
		return 0, false
	}
	return i, true
}

func isParamPassed(request *http.Request, param string) bool {
	_, ok := request.URL.Query()[param]
	return ok
}

func jsonResponse(response http.ResponseWriter, body interface{}, pretty bool) {
	var js []byte
	var err error
	if pretty {
		js, err = json.MarshalIndent(body, "", "  ")
	} else {
		js, err = json.Marshal(body)
	}
	if err != nil {
		http.Error(response, err.Error(), http.StatusInternalServerError)
		return
	}
	response.WriteHeader(200)
	response.Header().Set("Content-Type", "application/json")
	if _, err := response.Write(js); err != nil {
		fmt.Println(err)
	}
}

// Handlers
// ========

// Graphql
// -------

func registerGraphql(mux *http.ServeMux, db Db) {
	schema, err := InitSchema(db)
	if err != nil {
		panic(err)
	}

	h := handler.New(&handler.Config{
		Schema:   &schema,
		Pretty:   true,
		GraphiQL: true,
	})

	mux.Handle("/graphql", h)
}

// Graphiql
// --------

func registerGraphiql(mux *http.ServeMux) {
	graphiqlHandler, err := graphiql.NewGraphiqlHandler("/graphql")
	if err != nil {
		panic(err)
	}
	mux.Handle("/", graphiqlHandler)
}

// Search
// ------

func respondUnavailable(response http.ResponseWriter) {
	http.Error(response, "Service unavailable.", http.StatusServiceUnavailable)
}

func respondUnexpectedError(response http.ResponseWriter) {
	http.Error(response, "An unexpected error has occurred.", http.StatusInternalServerError)
}

func respondError(path string, err error, response http.ResponseWriter) {
	logEntry := log.WithError(err).WithField("path", path)
	if netError, ok := err.(net.Error); ok && netError.Timeout() {
		logEntry.Error("Server timed out.")
		respondUnexpectedError(response)
		return
	}
	switch t := err.(type) {
	case *net.OpError:
		if t.Op == "dial" {
			logEntry.Error("Dial error.")
			respondUnavailable(response)
			return
		} else if t.Op == "read" {
			logEntry.Error("Read error.")
			respondUnavailable(response)
			return
		}
		logEntry.Error("Unexpected op error.")

	case syscall.Errno:
		if t == syscall.ECONNREFUSED {
			logEntry.Error("Connection refused.")
			respondUnexpectedError(response)
			return
		}
		logEntry.Error("Unexpected sys error.")
	default:
		logEntry.Error("Unexpected error.")
	}
	// none of the above clauses handled the error
	respondUnexpectedError(response)
}

func registerSearch(mux *http.ServeMux, index Index) {
	path := "/search"
	mux.HandleFunc(path, func(response http.ResponseWriter, request *http.Request) {
		query, ok := requiredParamString(request, "q")
		if !ok {
			http.Error(response, "Missing required param 'q'.", http.StatusBadRequest)
			return
		}
		size, ok := requiredParamInt(request, "size")
		if !ok {
			size = 100
		}

		results, err := index.Search(query, size)
		if err != nil {
			respondError(path, err, response)
			return
		}
		jsonResponse(response, results, isParamPassed(request, "pretty"))
	})
}

// CORS
// ====

func buildOriginChecker(domains []string) (func(string) bool, error) {
	regexes := make([]*regexp.Regexp, 0)
	for _, domain := range domains {
		// escape everything
		pattern := regexp.QuoteMeta(domain)
		// replace the escaped wildcard with a real wildcard
		pattern = strings.ReplaceAll(pattern, "\\*", ".*")
		regex, err := regexp.Compile(pattern)
		if err != nil {
			return nil, err
		}
		log.WithField("pattern", pattern).Info("Allowing CORS domain pattern.")
		regexes = append(regexes, regex)
	}
	originChecker := func(origin string) bool {
		u, err := url.Parse(origin)
		if err != nil {
			log.WithError(err).Error("Could not parse origin.")
			return false
		}
		for _, regex := range regexes {
			if regex.MatchString(u.Hostname()) {
				return true
			}
		}
		log.WithField("origin", origin).Warn("Origin disallowed.")
		return false
	}
	return originChecker, nil
}

func configureCorsOrigin() (func(string) bool, error) {
	domainsStr := os.Getenv("CORS_DOMAINS")
	if domainsStr == "" {
		return nil, nil
	}
	domains := strings.Split(domainsStr, ",")
	return buildOriginChecker(domains)
}

func supportCors(mux *http.ServeMux) (http.Handler, error) {
	originChecker, err := configureCorsOrigin()
	if err != nil {
		return nil, err
	}
	if originChecker == nil {
		// no CORS configuration was available from the environment so
		// do whatever the default behavior is (no CORS)
		log.Info("CORS is disabled.")
		return mux, nil
	}
	c := cors.New(cors.Options{
		AllowCredentials: true,
		AllowOriginFunc:  originChecker,
		MaxAge:           60, //seconds
	})
	return c.Handler(mux), nil
}

// Public
// ======

func InitHttp(db Db, index Index) (http.Handler, error) {
	mux := http.NewServeMux()
	registerGraphql(mux, db)
	registerSearch(mux, index)
	registerGraphiql(mux)
	return supportCors(mux)
}

func StartHttp(handler http.Handler) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Info("Using default port.")
	}

	log.WithField("port", port).Info("Server is listening.")
	if err := http.ListenAndServe(":"+port, handler); err != nil {
		panic(err)
	}
}
