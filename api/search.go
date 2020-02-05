package main

import (
	"bytes"
	"context"
	"encoding/json"
	"github.com/elastic/go-elasticsearch/v7"
)

type SearchResult struct {
	Matches map[string][]string
	Id      EntityId
	Type    EntityType
}

type SearchResults struct {
	Results []*SearchResult
	Total   int
}

type Index interface {
	Search(query string, size int) (*SearchResults, error)
}

type esIndex struct {
	client *elasticsearch.Client
}

func NewEsIndex(client *elasticsearch.Client) Index {
	return &esIndex{client: client}
}

func (index *esIndex) Search(q string, size int) (*SearchResults, error) {
	var buf bytes.Buffer
	query := map[string]interface{}{
		"size": size,
		"query": map[string]interface{}{
			"query_string": map[string]interface{}{
				"query": q,
			},
		},
		"highlight": map[string]interface{}{
			"fields": map[string]interface{}{
				"*": map[string]interface{}{},
			},
		},
	}
	if err := json.NewEncoder(&buf).Encode(query); err != nil {
		return nil, err
	}

	// Perform the search request.
	response, err := index.client.Search(
		index.client.Search.WithBody(&buf),
		index.client.Search.WithContext(context.Background()),
		index.client.Search.WithTrackTotalHits(true),
	)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	if response.IsError() {
		return nil, responseToError(response.Body)
	}

	var searchResponse EsSearchResponse
	if err := json.NewDecoder(response.Body).Decode(&searchResponse); err != nil {
		return nil, err
	}

	results := make([]*SearchResult, len(searchResponse.Hits.Hits))
	for i, hit := range searchResponse.Hits.Hits {
		results[i] = &SearchResult{
			Matches: hit.Highlight,
			Id:      EntityId(hit.Id),
			Type:    EntityType(hit.Index),
		}
	}
	return &SearchResults{Results: results, Total: searchResponse.Hits.Total.Value}, err
}
