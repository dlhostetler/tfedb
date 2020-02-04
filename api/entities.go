package main

type EntityType string
type EntityId string
type Entity interface {
	GetId() EntityId
}

type GenericEntity map[string]interface{}

func (e GenericEntity) GetId() EntityId {
	return EntityId(e["id"].(string))
}
