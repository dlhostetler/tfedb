package main

import (
	"github.com/elastic/go-elasticsearch/v7"
	log "github.com/sirupsen/logrus"
	"os"
	"strings"
)

func NewEsClient() (*elasticsearch.Client, error) {
	address := os.Getenv("ES_URL")
	if address == "" {
		address = "http://localhost:9200"
		log.Info("Using default ES url.")
	}
	addresses := strings.Split(address, ",")
	cfg := elasticsearch.Config{
		Addresses: addresses,
	}
	log.WithField("urls", addresses).Info("Connecting to ES.")
	return elasticsearch.NewClient(cfg)
}

type EsSearchResponseHitsTotal struct {
	Relation string
	Value    int
}

type EsSearchHighlight map[string][]string

type EsSearchResponseHit struct {
	Highlight EsSearchHighlight
	Id        string        `json:"_id"`
	Index     string        `json:"_index"`
	Score     float64       `json:"_score"`
	Source    GenericEntity `json:"_source"`
}

type EsSearchResponseHits struct {
	Hits     []EsSearchResponseHit
	MaxScore float64 `json:"max_score"`
	Total    EsSearchResponseHitsTotal
}

type EsSearchResponse struct {
	Hits     EsSearchResponseHits
	TimedOut bool `json:"timed_out"`
	Took     int
}
