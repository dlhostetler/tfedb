package main

import "github.com/elastic/go-elasticsearch/v7"

// TODO: configurable host/port/etc.
func NewEsClient() (*elasticsearch.Client, error) {
	cfg := elasticsearch.Config{
		Addresses: []string{
			"http://localhost:9200",
		},
	}
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
