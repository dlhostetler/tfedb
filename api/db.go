package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/elastic/go-elasticsearch/v7"
	"io"
	"strings"
)

type Db interface {
	Fetch(t EntityType, id EntityId) (Entity, error)
	FetchAll(t EntityType, id []EntityId) ([]Entity, error)
	Random(t EntityType) (Entity, error)
}

type esDb struct {
	client *elasticsearch.Client
}

func NewEsDb(client *elasticsearch.Client) Db {
	return &esDb{client: client}
}

type getResponse struct {
	Found   bool
	Id      string        `json:"_id"`
	Index   string        `json:"_index"`
	Source  GenericEntity `json:"_source"`
	Version int           `json:"_version"`
}

func (r *getResponse) ToEntity() Entity {
	source := r.Source
	source["id"] = r.Id
	return source
}

func responseToError(body io.ReadCloser) error {
	var e map[string]interface{}
	if err := json.NewDecoder(body).Decode(&e); err != nil {
		return err
	}
	return errors.New(fmt.Sprintf("ElasticSearch error resposne: %s", e))
}

func (db *esDb) Fetch(t EntityType, id EntityId) (Entity, error) {
	response, err := db.client.Get(string(t), string(id))
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	if response.IsError() {
		return nil, responseToError(response.Body)
	}

	var getResponse getResponse
	if err := json.NewDecoder(response.Body).Decode(&getResponse); err != nil {
		return nil, err
	}
	return getResponse.ToEntity(), nil
}

type multiGetResponse struct {
	Docs []getResponse
}

func (db *esDb) FetchAll(t EntityType, ids []EntityId) ([]Entity, error) {
	r := strings.NewReader("{ \"docs\": [ { \"_index\": \"group\", \"_id\": \"65\" } ] }")
	response, err := db.client.Mget(r)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	if response.IsError() {
		return nil, responseToError(response.Body)
	}

	var multiGetResponse multiGetResponse
	if err := json.NewDecoder(response.Body).Decode(&multiGetResponse); err != nil {
		return nil, err
	}
	entities := make([]Entity, len(multiGetResponse.Docs))
	for i, getResponse := range multiGetResponse.Docs {
		entities[i] = getResponse.ToEntity()
	}
	return entities, nil
}

func (h *EsSearchResponseHit) ToEntity() Entity {
	source := h.Source
	source["id"] = h.Id
	return source
}

func (db *esDb) Random(t EntityType) (Entity, error) {
	var buf bytes.Buffer
	query := map[string]interface{}{
		"size": 1,
		"query": map[string]interface{}{
			"function_score": map[string]interface{}{
				"random_score": map[string]interface{}{},
			},
		},
	}
	if err := json.NewEncoder(&buf).Encode(query); err != nil {
		return nil, err
	}

	// Perform the search request.
	response, err := db.client.Search(
		db.client.Search.WithBody(&buf),
		db.client.Search.WithContext(context.Background()),
		db.client.Search.WithIndex(string(t)),
		db.client.Search.WithTrackTotalHits(true),
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
	return searchResponse.Hits.Hits[0].ToEntity(), nil
}
