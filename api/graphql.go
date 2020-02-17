package main

import (
	"fmt"
	"github.com/graphql-go/graphql"
	log "github.com/sirupsen/logrus"
)

func stringsToEnumValues(values []string) graphql.EnumValueConfigMap {
	m := graphql.EnumValueConfigMap{}
	for _, v := range values {
		m[v] = &graphql.EnumValueConfig{
			Value: v,
		}
	}
	return m
}

func addFields(o *graphql.Object, fields graphql.Fields) {
	for k, f := range fields {
		o.AddFieldConfig(k, f)
	}
}

func queryEntityResolver(db Db, entityType EntityType) graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		id := p.Args["id"]
		if id == nil {
			return db.Random(entityType)
		} else {
			entityId := EntityId(id.(string))
			return db.Fetch(entityType, entityId)
		}
	}
}

func targetEntityId(v interface{}) EntityId {
	return EntityId(fmt.Sprintf("%v", v))
}

func fieldEntityResolver(db Db, entityType EntityType, field string) graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		var fieldVal interface{}
		switch m := p.Source.(type) {
		case map[string]interface{}:
			fieldVal = m[field]
		case GenericEntity:
			fieldVal = m[field]
		default:
			log.WithFields(map[string]interface{}{
				"entityType":  entityType,
				"field":       field,
				"sourceNull?": p.Source == nil,
				"sourceType":  fmt.Sprintf("%T", p.Source),
			}).Warn("Could not determine entity id from field.")
		}
		if fieldVal == nil {
			return nil, nil
		}
		x, err := db.Fetch(entityType, targetEntityId(fieldVal))
		return x, err
	}
}

func fieldEntitiesResolver(db Db, entityType EntityType, field string) graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		var fieldValue interface{}
		switch m := p.Source.(type) {
		case map[string]interface{}:
			fieldValue = m[field]
		case GenericEntity:
			fieldValue = m[field]
		default:
			log.WithFields(map[string]interface{}{
				"entityType":  entityType,
				"field":       field,
				"sourceNull?": p.Source == nil,
				"sourceType":  fmt.Sprintf("%T", p.Source),
			}).Warn("Could not determine entity ids from field.")
		}
		if fieldValue == nil {
			return nil, nil
		}
		idInterfaces := fieldValue.([]interface{})
		targetEntityIds := make([]EntityId, len(idInterfaces))
		for i, v := range idInterfaces {
			targetEntityIds[i] = targetEntityId(v)
		}
		x, err := db.FetchAll(entityType, targetEntityIds)
		return x, err
	}
}

func InitSchema(db Db) (graphql.Schema, error) {
	// Enums
	actionFlag := graphql.NewEnum(graphql.EnumConfig{
		Name: "actionFlag",
		Values: stringsToEnumValues([]string{
			"down",
			"east",
			"north",
			"south",
			"west",
			"up,",
		}),
	})

	actionTrigger := graphql.NewEnum(graphql.EnumConfig{
		Name: "actionTrigger",
		Values: stringsToEnumValues([]string{
			"attack",
			"close_door",
			"entering",
			"knock_door",
			"leaving",
			"lock_door",
			"none",
			"open_door",
			"random",
			"random_always",
			"sacrifice",
			"searching",
			"time",
			"unlock_door",
		}),
	})

	antiType := graphql.NewEnum(graphql.EnumConfig{
		Name: "antiType",
		Values: stringsToEnumValues([]string{
			"anti_centaur",
			"anti_chaotic",
			"anti_dwarf",
			"anti_elf",
			"anti_ent",
			"anti_evil",
			"anti_gnome",
			"anti_goblin",
			"anti_good",
			"anti_halfling",
			"anti_human",
			"anti_lawful",
			"anti_lizard",
			"anti_mage",
			"anti_monk",
			"anti_neutral",
			"anti_ogre",
			"anti_orc",
			"anti_psionic",
			"anti_troll",
			"anti_unused1",
			"anti_unused2",
			"anti_unused3",
			"anti_vyan",
		}),
	})

	attributeName := graphql.NewEnum(graphql.EnumConfig{
		Name: "attributeName",
		Values: stringsToEnumValues([]string{
			"constitution",
			"dexterity",
			"intelligence",
			"strength",
			"wisdom",
		}),
	})

	dicePurpose := graphql.NewEnum(graphql.EnumConfig{
		Name: "dicePurpose",
		Values: stringsToEnumValues([]string{
			"hp",
			"movement",
		}),
	})

	direction := graphql.NewEnum(graphql.EnumConfig{
		Name: "direction",
		Values: stringsToEnumValues([]string{
			"d",
			"e",
			"n",
			"s",
			"u",
			"w",
		}),
	})

	material := graphql.NewEnum(graphql.EnumConfig{
		Name: "material",
		Values: stringsToEnumValues([]string{
			"adamantine",
			"bone",
			"bronze",
			"cloth",
			"copper",
			"electrum",
			"flesh",
			"glass",
			"gold",
			"iron",
			"krynite",
			"leather",
			"mithril",
			"organic",
			"paper",
			"platinum",
			"silver",
			"steel",
			"stone",
			"unused1",
			"unused2",
			"wood",
		}),
	})

	mobAffect := graphql.NewEnum(graphql.EnumConfig{
		Name: "mobAffect",
		Values: stringsToEnumValues([]string{
			"armor",
			"axe_prof",
			"barkskin",
			"bless",
			"blind",
			"bow_prof",
			"camouflage",
			"chill",
			"choking",
			"confused",
			"continual_light",
			"curse",
			"death",
			"detect_evil",
			"detect_good",
			"detect_hidden",
			"detect_magic",
			"displace",
			"entangled",
			"faerie_fire",
			"fire_shield",
			"float",
			"fly",
			"hallucinate",
			"haste",
			"hide",
			"infrared",
			"invisible",
			"invulnerability",
			"ion_shield",
			"life_saving",
			"light_sensitive",
			"ogre_strength",
			"paralysis",
			"pass_door",
			"plague",
			"poison",
			"prot_plants",
			"protect",
			"protect_evil",
			"protect_good",
			"rabies",
			"regeneration",
			"resist_acid",
			"resist_cold",
			"resist_fire",
			"resist_poison",
			"resist_shock",
			"sanctuary",
			"see_camouflage",
			"see_invis",
			"sense_danger",
			"sense_life",
			"silence",
			"sleep",
			"sleep_resist",
			"slow",
			"sneak",
			"speed",
			"sword_prof",
			"thorn_shield",
			"tomb_rot",
			"tongues",
			"true_sight",
			"vitality",
			"water_breathing",
			"water_walking",
			"wrath",
		}),
	})

	objectAffectType := graphql.NewEnum(graphql.EnumConfig{
		Name: "objectAffectType",
		Values: stringsToEnumValues([]string{
			"acid",
			"age",
			"armor",
			"cold",
			"constitution",
			"damroll",
			"dexterity",
			"electricity",
			"fire",
			"hit_regen",
			"hitroll",
			"hp",
			"intelligence",
			"magic",
			"mana",
			"mana_regen",
			"mind",
			"move",
			"move_regen",
			"none",
			"poison",
			"strength",
			"unused1",
			"unused2",
			"wisdom",
		}),
	})

	objectFlag := graphql.NewEnum(graphql.EnumConfig{
		Name: "objectFlag",
		Values: stringsToEnumValues([]string{
			"additive",
			"appraised",
			"backstab",
			"body_part",
			"burning",
			"chair",
			"copied",
			"cover",
			"dark",
			"evil",
			"flaming",
			"glow",
			"good",
			"hum",
			"identified",
			"inventory",
			"is_invis",
			"known_liquid",
			"lock",
			"magic",
			"no_auction",
			"no_disarm",
			"no_enchant",
			"no_junk",
			"no_major",
			"no_sell",
			"no_shield",
			"nodrop",
			"noremove",
			"nosacrifice",
			"nosave",
			"noshow",
			"poison_coated",
			"random_metal",
			"replicate",
			"rust_proof",
			"sanct",
			"the",
			"two_hand",
			"water_proof",
		}),
	})

	objectType := graphql.NewEnum(graphql.EnumConfig{
		Name: "objectType",
		Values: stringsToEnumValues([]string{
			"armor",
			"arrow",
			"bandage",
			"boat",
			"body_part",
			"book",
			"bounty",
			"chair",
			"container",
			"corpse",
			"cross",
			"deck_cards",
			"drink_container",
			"fire",
			"food",
			"fountain",
			"furniture",
			"garrote",
			"gate",
			"gem",
			"key",
			"key_ring",
			"light",
			"light_perm",
			"lockpick",
			"money",
			"other",
			"pipe",
			"potion",
			"reagent",
			"scroll",
			"skin",
			"spellbook",
			"staff",
			"table",
			"tobacco",
			"trap",
			"trash",
			"treasure",
			"unused",
			"wand",
			"weapon",
			"whistle",
		}),
	})

	resistType := graphql.NewEnum(graphql.EnumConfig{
		Name: "resistType",
		Values: stringsToEnumValues([]string{
			"acid",
			"cold",
			"fire",
			"magic",
			"mind",
			"poison",
			"shock",
		}),
	})

	restriction := graphql.NewEnum(graphql.EnumConfig{
		Name: "restriction",
		Values: stringsToEnumValues([]string{
			"bladed",
			"dishonorable",
			"no_hide",
			"no_sneak",
		}),
	})

	roomFlag := graphql.NewEnum(graphql.EnumConfig{
		Name: "roomFlag",
		Values: stringsToEnumValues([]string{
			"altar",
			"altar_evil",
			"altar_good",
			"altar_neutral",
			"arena",
			"auction_house",
			"bank",
			"donation",
			"indoors",
			"lit",
			"no_autoscan",
			"no_magic",
			"no_mob",
			"no_mount",
			"no_pkill",
			"no_pray",
			"no_recall",
			"office",
			"pet_shop",
			"reset0",
			"reset1",
			"reset2",
			"safe",
			"save_items",
			"shop",
			"status0",
			"status1",
			"status2",
			"underground",
		}),
	})

	scriptType := graphql.NewEnum(graphql.EnumConfig{
		Name: "scriptType",
		Values: stringsToEnumValues([]string{
			"ask",
			"attack",
			"death",
			"die",
			"enter",
			"flee",
			"give",
			"kill",
			"leave",
			"sleep",
			"to",
		}),
	})

	sector := graphql.NewEnum(graphql.EnumConfig{
		Name: "sector",
		Values: stringsToEnumValues([]string{
			"air",
			"caves",
			"city",
			"desert",
			"field",
			"forest",
			"hills",
			"inside",
			"mountain",
			"river",
			"road",
			"shallows",
			"underwater",
			"water_surface",
		}),
	})

	sex := graphql.NewEnum(graphql.EnumConfig{
		Name: "sex",
		Values: stringsToEnumValues([]string{
			"female",
			"male",
			"neutral",
			"random",
		}),
	})

	size := graphql.NewEnum(graphql.EnumConfig{
		Name: "size",
		Values: stringsToEnumValues([]string{
			"ant",
			"dinosaur",
			"dog",
			"elephant",
			"giant",
			"gnome",
			"horse",
			"human",
			"ogre",
			"rat",
		}),
	})

	spawnFlag := graphql.NewEnum(graphql.EnumConfig{
		Name: "spawnFlag",
		Values: stringsToEnumValues([]string{
			"aggressive",
			"container",
			"day",
			"follower",
			"inside",
			"leader",
			"night",
			"reroll",
			"sentinel",
			"unknown",
		}),
	})

	spawnPosition := graphql.NewEnum(graphql.EnumConfig{
		Name: "spawnPosition",
		Values: stringsToEnumValues([]string{
			"ground",
			"inventory",
			"meditating",
			"resting",
			"sleeping",
			"standing",
			"unknown",
		}),
	})

	status := graphql.NewEnum(graphql.EnumConfig{
		Name: "status",
		Values: stringsToEnumValues([]string{
			"abandoned",
			"blank",
			"immortal",
			"open",
			"pending",
			"progressing",
			"worthless",
		}),
	})

	wearLayer := graphql.NewEnum(graphql.EnumConfig{
		Name: "wearLayer",
		Values: stringsToEnumValues([]string{
			"base",
			"bottom",
			"over",
			"top",
			"under",
		}),
	})

	wearLocation := graphql.NewEnum(graphql.EnumConfig{
		Name: "wearLocation",
		Values: stringsToEnumValues([]string{
			"held_left",
			"held_right",
			"take",
			"unused2",
			"unused3",
			"wear_arms",
			"wear_body",
			"wear_feet",
			"wear_finger",
			"wear_hands",
			"wear_head",
			"wear_horse_back",
			"wear_horse_body",
			"wear_horse_feet",
			"wear_legs",
			"wear_neck",
			"wear_unused0",
			"wear_unused1",
			"wear_unused2",
			"wear_unused3",
			"wear_waist",
			"wear_wrist",
		}),
	})

	wearSize := graphql.NewEnum(graphql.EnumConfig{
		Name: "wearSize",
		Values: stringsToEnumValues([]string{
			"centaur",
			"custom",
			"dwarf",
			"elf",
			"ent",
			"giant",
			"gnome",
			"goblin",
			"halfling",
			"human",
			"large",
			"lizard",
			"medium",
			"ogre",
			"orc",
			"race",
			"random",
			"size",
			"small",
			"tiny",
			"troll",
			"vyan",
		}),
	})

	// Entity pre-declarations
	liquid := graphql.NewObject(graphql.ObjectConfig{
		Name:        "liquid",
		Description: "What it sounds like.",
		Fields:      graphql.Fields{},
	})

	mob := graphql.NewObject(graphql.ObjectConfig{
		Name:        "mob",
		Description: "A mobile entity.",
		Fields:      graphql.Fields{},
	})

	nation := graphql.NewObject(graphql.ObjectConfig{
		Name:        "nation",
		Description: "A geographical location that mobs belong to.",
		Fields:      graphql.Fields{},
	})

	object := graphql.NewObject(graphql.ObjectConfig{
		Name:        "object",
		Description: "An inanimate thing.",
		Fields:      graphql.Fields{},
	})

	race := graphql.NewObject(graphql.ObjectConfig{
		Name:        "race",
		Description: "Species of mobs.",
		Fields:      graphql.Fields{},
	})

	recipe := graphql.NewObject(graphql.ObjectConfig{
		Name:        "recipe",
		Description: "A set of ingredients and a location to make a custom object.",
		Fields:      graphql.Fields{},
	})

	room := graphql.NewObject(graphql.ObjectConfig{
		Name:        "room",
		Description: "A location in the world.",
		Fields:      graphql.Fields{},
	})

	trainer := graphql.NewObject(graphql.ObjectConfig{
		Name:        "trainer",
		Description: "A mob and a room in which a player can learn skills.",
		Fields:      graphql.Fields{},
	})

	// Sub-entity pre-declarations
	script := graphql.NewObject(graphql.ObjectConfig{
		Name:        "script",
		Description: "Code that runs.",
		Fields:      graphql.Fields{},
	})

	// Sub-entities
	action := graphql.NewObject(graphql.ObjectConfig{
		Name:        "action",
		Description: "Things that occur on triggers.",
		Fields: graphql.Fields{
			"flags": &graphql.Field{
				Type: graphql.NewList(actionFlag),
			},
			"id": &graphql.Field{
				Type: graphql.ID,
			},
			"room": &graphql.Field{
				Type:    room,
				Resolve: fieldEntityResolver(db, "room", "roomId"),
			},
			"script": &graphql.Field{
				Type: script,
			},
			"targets": &graphql.Field{
				Type: graphql.NewList(graphql.String),
			},
			"trigger": &graphql.Field{
				Type: actionTrigger,
			},
			"value": &graphql.Field{
				Type: graphql.Int,
			},
			"verbs": &graphql.Field{
				Type: graphql.String,
			},
		},
	})

	alignment := graphql.NewObject(graphql.ObjectConfig{
		Name:        "alignment",
		Description: "The moral alignment of a mob.",
		Fields: graphql.Fields{
			"abbreviation": &graphql.Field{
				Type: graphql.String,
			},
			"id": &graphql.Field{
				Type: graphql.Int,
			},
			"name": &graphql.Field{
				Type: graphql.String,
			},
		},
	})

	armor := graphql.NewObject(graphql.ObjectConfig{
		Name:        "armor",
		Description: "The armor spwan of a mob.",
		Fields: graphql.Fields{
			"armor": &graphql.Field{
				Type: graphql.Int,
			},
			"chance": &graphql.Field{
				Type: graphql.Int,
			},
			"name": &graphql.Field{
				Type: graphql.String,
			},
		},
	})

	attribute := graphql.NewObject(graphql.ObjectConfig{
		Name:        "attribute",
		Description: "A mob's attribute.",
		Fields: graphql.Fields{
			"type": &graphql.Field{
				Type: attributeName,
			},
			"value": &graphql.Field{
				Type: graphql.Int,
			},
		},
	})

	dice := graphql.NewObject(graphql.ObjectConfig{
		Name:        "dice",
		Description: "Configuration of a dice to roll.",
		Fields: graphql.Fields{
			"number": &graphql.Field{
				Type: graphql.Int,
			},
			"plus": &graphql.Field{
				Type: graphql.Int,
			},
			"sides": &graphql.Field{
				Type: graphql.Int,
			},
		},
	})

	exit := graphql.NewObject(graphql.ObjectConfig{
		Name:        "exit",
		Description: "Connects two rooms.",
		Fields: graphql.Fields{
			"dir": &graphql.Field{
				Type: direction,
			},
			"fromRoom": &graphql.Field{
				Type:    room,
				Resolve: fieldEntityResolver(db, "room", "fromRoomId"),
			},
			"id": &graphql.Field{
				Type: graphql.ID,
			},
			"key": &graphql.Field{
				Type:    object,
				Resolve: fieldEntityResolver(db, "object", "keyId"),
			},
			"light": &graphql.Field{
				Type: graphql.Int,
			},
			"size": &graphql.Field{
				Type: size,
			},
			"strength": &graphql.Field{
				Type: graphql.Int,
			},
			"toRoom": &graphql.Field{
				Type:    room,
				Resolve: fieldEntityResolver(db, "room", "toRoomId"),
			},
		},
	})

	group := graphql.NewObject(graphql.ObjectConfig{
		Name:        "group",
		Description: "The group a mob belongs to.",
		Fields: graphql.Fields{
			"id": &graphql.Field{
				Type: graphql.Int,
			},
			"name": &graphql.Field{
				Type: graphql.String,
			},
		},
	})

	ingredient := graphql.NewObject(graphql.ObjectConfig{
		Name:        "ingredient",
		Description: "The object and how many of them that goes into customizing another object..",
		Fields: graphql.Fields{
			"numRequired": &graphql.Field{
				Type: graphql.Int,
			},
			"object": &graphql.Field{
				Type:    object,
				Resolve: fieldEntityResolver(db, "object", "objectId"),
			},
		},
	})

	mobDice := graphql.NewObject(graphql.ObjectConfig{
		Name:        "mobDice",
		Description: "The dice that control what a mob does.",
		Fields: graphql.Fields{
			"dice": &graphql.Field{
				Type: dice,
			},
			"purpose": &graphql.Field{
				Type: dicePurpose,
			},
		},
	})

	mobject := graphql.NewObject(graphql.ObjectConfig{
		Name:        "mobject",
		Description: "Objects that spawn on a mob.",
		Fields: graphql.Fields{
			// TODO: chances == dice?
			"chances": &graphql.Field{
				Type: graphql.Int,
			},
			// TODO: what determines where this object spawns?
			"flags": &graphql.Field{
				Type: graphql.Int,
			},
			"liquid": &graphql.Field{
				Type: liquid,
			},
			"object": &graphql.Field{
				Type:    object,
				Resolve: fieldEntityResolver(db, "object", "objectId"),
			},
			"value": &graphql.Field{
				Type: graphql.Int,
			},
		},
	})

	objectAffect := graphql.NewObject(graphql.ObjectConfig{
		Name:        "objectAffect",
		Description: "An affect applied to an object.",
		Fields: graphql.Fields{
			"amount": &graphql.Field{
				Type: graphql.Int,
			},
			"type": &graphql.Field{
				Type: objectAffectType,
			},
		},
	})

	objectDescription := graphql.NewObject(graphql.ObjectConfig{
		Name:        "objectDescription",
		Description: "Various descriptions for an object.",
		Fields: graphql.Fields{
			"description": &graphql.Field{
				Type: graphql.String,
			},
			"keywords": &graphql.Field{
				Type: graphql.String,
			},
		},
	})

	poi := graphql.NewObject(graphql.ObjectConfig{
		Name:        "poi",
		Description: "Something to look at in a room.",
		Fields: graphql.Fields{
			"description": &graphql.Field{
				Type: graphql.String,
			},
			"keywords": &graphql.Field{
				Type: graphql.String,
			},
		},
	})

	resist := graphql.NewObject(graphql.ObjectConfig{
		Name:        "resist",
		Description: "Resistence to a type of damage.",
		Fields: graphql.Fields{
			"type": &graphql.Field{
				Type: resistType,
			},
			"value": &graphql.Field{
				Type: graphql.Int,
			},
		},
	})

	scriptDescription := graphql.NewObject(graphql.ObjectConfig{
		Name:        "scriptDescription",
		Description: "Variables in scripts for text..",
		Fields: graphql.Fields{
			"placeholder": &graphql.Field{
				Type: graphql.String,
			},
			"value": &graphql.Field{
				Type: graphql.String,
			},
		},
	})

	addFields(script, graphql.Fields{
		"code": &graphql.Field{
			Type: graphql.String,
		},
		"descriptions": &graphql.Field{
			Type: graphql.NewList(scriptDescription),
		},
		"type": &graphql.Field{
			Type: scriptType,
		},
	})

	skill := graphql.NewObject(graphql.ObjectConfig{
		Name:        "skill",
		Description: "A trainable ability for players.",
		Fields: graphql.Fields{
			"id": &graphql.Field{
				Type: graphql.String,
			},
			"trainers": &graphql.Field{
				Type:    graphql.NewList(trainer),
				Resolve: fieldEntitiesResolver(db, "trainer", "trainerIds"),
			},
		},
	})

	spawn := graphql.NewObject(graphql.ObjectConfig{
		Name:        "spawn",
		Description: "Something that can spawn in a room.",
		Fields: graphql.Fields{
			"chances": &graphql.Field{
				Type: graphql.Int,
			},
			"flags": &graphql.Field{
				Type: graphql.NewList(spawnFlag),
			},
			"liquid": &graphql.Field{
				Type:        liquid,
				Description: "The liquid in a ground object spawn (ex: a stream).",
				Resolve:     fieldEntityResolver(db, "liquid", "liquidId"),
			},
			"mob": &graphql.Field{
				Type: mob,
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					if e, ok := p.Source.(map[string]interface{}); ok {
						if e["spawnType"] == "mob" {
							return db.Fetch("mob", targetEntityId(e["spawnId"]))
						}
					}
					return nil, nil
				},
			},
			"object": &graphql.Field{
				Type: object,
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					if e, ok := p.Source.(map[string]interface{}); ok {
						if e["spawnType"] == "object" {
							return db.Fetch("object", targetEntityId(e["spawnId"]))
						}
					}
					return nil, nil
				},
			},
			"position": &graphql.Field{
				Type: spawnPosition,
			},
			"value": &graphql.Field{
				Type: graphql.Int,
			},
		},
	})

	// Entities
	addFields(liquid, graphql.Fields{
		"alcohol": &graphql.Field{
			Type: graphql.Int,
		},
		"color": &graphql.Field{
			Type: graphql.String,
		},
		"costPerLiter": &graphql.Field{
			Type: graphql.Int,
		},
		"creatable": &graphql.Field{
			Type: graphql.Boolean,
		},
		"hunger": &graphql.Field{
			Type: graphql.Int,
		},
		"id": &graphql.Field{
			Type: graphql.Int,
		},
		"name": &graphql.Field{
			Type: graphql.String,
		},
		"thirst": &graphql.Field{
			Type: graphql.Int,
		},
	})

	addFields(mob, graphql.Fields{
		"adjectives": &graphql.Field{
			Type: graphql.String,
		},
		"adjectivesPlural": &graphql.Field{
			Type: graphql.String,
		},
		"adult": &graphql.Field{
			Type: graphql.Int,
		},
		"affects": &graphql.Field{
			Type: graphql.NewList(mobAffect),
		},
		"alignment": &graphql.Field{
			Type:    alignment,
			Resolve: fieldEntityResolver(db, "alignment", "alignmentId"),
		},
		"appearance": &graphql.Field{
			Type:        graphql.String,
			Description: "The unidentified appearance of the mob.",
		},
		"appearancePlural": &graphql.Field{
			Type: graphql.String,
		},
		"armor": &graphql.Field{
			Type: graphql.NewList(armor),
		},
		"attacks": &graphql.Field{
			Type: script,
		},
		"attributes": &graphql.Field{
			Type: graphql.NewList(attribute),
		},
		"corpse": &graphql.Field{
			Type:    object,
			Resolve: fieldEntityResolver(db, "object", "corpseId"),
		},
		"creator": &graphql.Field{
			Type: graphql.String,
		},
		"description": &graphql.Field{
			Type: graphql.String,
		},
		"dice": &graphql.Field{
			Type: graphql.NewList(mobDice),
		},
		"gold": &graphql.Field{
			Type: graphql.Int,
		},
		"group": &graphql.Field{
			Type:    group,
			Resolve: fieldEntityResolver(db, "group", "groupId"),
		},
		"herePluralPrefix": &graphql.Field{
			Type: graphql.String,
		},
		"herePluralSuffix": &graphql.Field{
			Type: graphql.String,
		},
		"herePrefix": &graphql.Field{
			Type: graphql.String,
		},
		"hereSuffix": &graphql.Field{
			Type: graphql.String,
		},
		"id": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.String),
			Description: "The id of the mob.",
		},
		"keywords": &graphql.Field{
			Type: graphql.String,
		},
		"level": &graphql.Field{
			Type: graphql.Int,
		},
		"maturity": &graphql.Field{
			Type: graphql.Int,
		},
		"name": &graphql.Field{
			Type:        graphql.String,
			Description: "The name of the mob. Some don't have names.",
		},
		"nation": &graphql.Field{
			Type:    nation,
			Resolve: fieldEntityResolver(db, "nation", "nationId"),
		},
		"objects": &graphql.Field{
			Type: graphql.NewList(mobject),
		},
		"race": &graphql.Field{
			Type:    race,
			Resolve: fieldEntityResolver(db, "race", "raceId"),
		},
		"resists": &graphql.Field{
			Type: graphql.NewList(resist),
		},
		"rooms": &graphql.Field{
			Type:    graphql.NewList(room),
			Resolve: fieldEntitiesResolver(db, "room", "roomIds"),
		},
		"scripts": &graphql.Field{
			Type: graphql.NewList(script),
		},
		"sex": &graphql.Field{
			Type: sex,
		},
		"size": &graphql.Field{
			Type: graphql.Int,
		},
		"skeleton": &graphql.Field{
			Type:    mob,
			Resolve: fieldEntityResolver(db, "mob", "skeletonId"),
		},
		"weight": &graphql.Field{
			Type: graphql.Int,
		},
		"zombie": &graphql.Field{
			Type:    mob,
			Resolve: fieldEntityResolver(db, "mob", "zombieId"),
		},
	})

	addFields(nation, graphql.Fields{
		"abbreviation": &graphql.Field{
			Type: graphql.String,
		},
		"id": &graphql.Field{
			Type: graphql.Int,
		},
		"name": &graphql.Field{
			Type: graphql.String,
		},
		"temple": &graphql.Field{
			Type: graphql.Int,
		},
	})

	addFields(object, graphql.Fields{
		"ac": &graphql.Field{
			Type: graphql.Int,
		},
		"acGlobal": &graphql.Field{
			Type: graphql.Int,
		},
		"affects": &graphql.Field{
			Type: graphql.NewList(objectAffect),
		},
		"anti": &graphql.Field{
			Type: graphql.NewList(antiType),
		},
		"attack": &graphql.Field{
			Type: graphql.Int,
		},
		"blocks": &graphql.Field{
			Type: graphql.Int,
		},
		"capacity": &graphql.Field{
			Type: graphql.Int,
		},
		"charges": &graphql.Field{
			Type: graphql.Int,
		},
		"cost": &graphql.Field{
			Type: graphql.Int,
		},
		"creator": &graphql.Field{
			Type: graphql.String,
		},
		"damage": &graphql.Field{
			Type: dice,
		},
		"descriptions": &graphql.Field{
			Type: graphql.NewList(objectDescription),
		},
		"durability": &graphql.Field{
			Type: graphql.Int,
		},
		"enchantment": &graphql.Field{
			Type: graphql.Int,
		},
		"flags": &graphql.Field{
			Type: graphql.NewList(objectFlag),
		},
		"halflife": &graphql.Field{
			Type: graphql.Int,
		},
		"herePrefix": &graphql.Field{
			Type: graphql.String,
		},
		"hereSuffix": &graphql.Field{
			Type: graphql.String,
		},
		"herePluralPrefix": &graphql.Field{
			Type: graphql.String,
		},
		"herePluralSuffix": &graphql.Field{
			Type: graphql.String,
		},
		"id": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
		"ingredientFor": &graphql.Field{
			Type:    graphql.NewList(recipe),
			Resolve: fieldEntitiesResolver(db, "recipe", "ingredientForIds"),
		},
		"key": &graphql.Field{
			Type:    object,
			Resolve: fieldEntityResolver(db, "object", "keyId"),
		},
		"layers": &graphql.Field{
			Type: graphql.NewList(wearLayer),
		},
		"level": &graphql.Field{
			Type: graphql.Int,
		},
		"light": &graphql.Field{
			Type: graphql.Int,
		},
		"limit": &graphql.Field{
			Type: graphql.Int,
		},
		"materials": &graphql.Field{
			Type: graphql.NewList(material),
		},
		"mob": &graphql.Field{
			Type:        mob,
			Description: "The mob for which this is a corpse for (if this is a corpse).",
			Resolve:     fieldEntityResolver(db, "mob", "mobId"),
		},
		"mobs": &graphql.Field{
			Type:    graphql.NewList(mob),
			Resolve: fieldEntitiesResolver(db, "mob", "mobIds"),
		},
		"name": &graphql.Field{
			Type: graphql.String,
		},
		"namePlural": &graphql.Field{
			Type: graphql.String,
		},
		"nourishment": &graphql.Field{
			Type: graphql.Int,
		},
		"recipes": &graphql.Field{
			Type:    graphql.NewList(recipe),
			Resolve: fieldEntitiesResolver(db, "recipe", "recipeIds"),
		},
		"repair": &graphql.Field{
			Type: graphql.Int,
		},
		"restriction": &graphql.Field{
			Type: graphql.NewList(restriction),
		},
		"rooms": &graphql.Field{
			Type:    graphql.NewList(room),
			Resolve: fieldEntitiesResolver(db, "room", "roomIds"),
		},
		"size": &graphql.Field{
			Type: graphql.NewList(wearSize),
		},
		"subtype": &graphql.Field{
			Type: objectType,
		},
		"unlocksContainers": &graphql.Field{
			Type:    graphql.NewList(object),
			Resolve: fieldEntitiesResolver(db, "object", "unlocksContainerIds"),
		},
		"unlocksExits": &graphql.Field{
			Type:    graphql.NewList(exit),
			Resolve: fieldEntitiesResolver(db, "object", "unlocksExitIds"),
		},
		//:updater {:type String}
		"updater": &graphql.Field{
			Type: graphql.String,
		},
		"wearLocations": &graphql.Field{
			Type: graphql.NewList(wearLocation),
		},
		"weight": &graphql.Field{
			Type: graphql.Int,
		},
	})

	addFields(race, graphql.Fields{
		"abbreviation": &graphql.Field{
			Type: graphql.String,
		},
		"id": &graphql.Field{
			Type: graphql.Int,
		},
		"name": &graphql.Field{
			Type: graphql.String,
		},
	})

	addFields(recipe, graphql.Fields{
		"cost": &graphql.Field{
			Type: graphql.Int,
		},
		"id": &graphql.Field{
			Type: graphql.ID,
		},
		"ingredients": &graphql.Field{
			Type: graphql.NewList(ingredient),
		},
		"mob": &graphql.Field{
			Type:    mob,
			Resolve: fieldEntityResolver(db, "mob", "mobId"),
		},
		"object": &graphql.Field{
			Type:    object,
			Resolve: fieldEntityResolver(db, "object", "objectId"),
		},
		"room": &graphql.Field{
			Type:    room,
			Resolve: fieldEntityResolver(db, "room", "roomId"),
		},
	})

	addFields(room, graphql.Fields{
		"actions": &graphql.Field{
			Type: graphql.NewList(action),
		},
		"area": &graphql.Field{
			Type: graphql.String,
		},
		"author": &graphql.Field{
			Type: graphql.String,
		},
		"comments": &graphql.Field{
			Type: graphql.String,
		},
		"description": &graphql.Field{
			Type: graphql.String,
		},
		"exits": &graphql.Field{
			Type:    graphql.NewList(exit),
			Resolve: fieldEntitiesResolver(db, "exit", "exitIds"),
		},
		"flags": &graphql.Field{
			Type: graphql.NewList(roomFlag),
		},
		"id": &graphql.Field{
			Type: graphql.String,
		},
		"level": &graphql.Field{
			Type: graphql.Int,
		},
		"name": &graphql.Field{
			Type: graphql.String,
		},
		"pois": &graphql.Field{
			Type: graphql.NewList(poi),
		},
		"recipes": &graphql.Field{
			Type:    graphql.NewList(recipe),
			Resolve: fieldEntitiesResolver(db, "recipe", "recipeIds"),
		},
		"sector": &graphql.Field{
			Type: sector,
		},
		"size": &graphql.Field{
			Type: size,
		},
		"spawns": &graphql.Field{
			Type: graphql.NewList(spawn),
		},
		"status": &graphql.Field{
			Type: status,
		},
	})

	addFields(trainer, graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.ID,
		},
		"mob": &graphql.Field{
			Type:    mob,
			Resolve: fieldEntityResolver(db, "mob", "mobId"),
		},
		"room": &graphql.Field{
			Type:    room,
			Resolve: fieldEntityResolver(db, "room", "roomId"),
		},
		//:skills {:type (list String)}
		"skills": &graphql.Field{
			Type:    graphql.NewList(skill),
			Resolve: fieldEntitiesResolver(db, "skill", "skills"),
		},
	})

	// Query
	query := graphql.Fields{
		"mob": &graphql.Field{
			Type: mob,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Description: "id of the mob",
					Type:        graphql.String,
				},
			},
			Resolve: queryEntityResolver(db, "mob"),
		},
		"object": &graphql.Field{
			Type: object,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Description: "id of the object",
					Type:        graphql.String,
				},
			},
			Resolve: queryEntityResolver(db, "object"),
		},
		"room": &graphql.Field{
			Type: room,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Description: "id of the room",
					Type:        graphql.String,
				},
			},
			Resolve: queryEntityResolver(db, "room"),
		},
	}

	rootQuery := graphql.ObjectConfig{Name: "RootQuery", Fields: query}
	schemaConfig := graphql.SchemaConfig{Query: graphql.NewObject(rootQuery)}
	return graphql.NewSchema(schemaConfig)
}
