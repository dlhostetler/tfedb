import React from 'react';
import * as entity from '../../../../../types/entity';
import { get, isEmpty, sortBy } from 'lodash';
import { useParams } from 'react-router-dom';
import { useGraphql } from '../../../../../hooks';
import {
  Entity,
  EntityName,
  EntitySection,
  EntitySubheader,
  ObjectHere,
} from '../../../../entity';
import Row from '../../../../layout/Row';
import WearableInfo from './WearableInfo';
import SpecialInfo from './SpecialInfo';
import BasicInfo from './BasicInfo';
import Metadata from './Metadata';
import Descriptions from './Descriptions';
import Mobs from '../../../../entity/Mobs';
import Rooms from '../../../../entity/Rooms';
import Recipes from '../../../../entity/Recipes';
import Objects from '../../../../entity/Objects';

interface ObjectResult {
  object: entity.Object;
}

interface Params {
  objectId: string;
}

const query = `query Object($objectId: String) {
  object(id: $objectId) {
    ac
    acGlobal
    affects {
      amount
      type
    }
    anti
    attack
    blocks
    capacity
    charges
    cost
    creator
    damage {
      number
      plus
      sides
    }
    descriptions {
      description
      keywords
    }
    durability
    enchantment
    flags
    halflife
    herePluralPrefix
    herePluralSuffix
    herePrefix
    hereSuffix
    id
    ingredientFor {
      object {
        id
        name
      }
    }
    key {
      id
      name
    }
    layers
    level
    light
    limit
    materials
    mob {
      appearance
      id
      name
    }
    mobs {
      appearance
      id
      name
    }
    name
    namePlural
    nourishment
    recipes {
      id
      mob {
        appearance
        id
        name
      }
      room {
        id
        name
      }
    }
    repair
    restriction
    rooms {
      id
      name
    }
    size
    subtype
    unlocksContainers {
      id
      name
    }
    unlocksExits {
      fromRoom {
        id
        name
      }
      toRoom {
        id
        name
      }
    }
    updater
    wearLocations
    weight
  }
}`;

function ingredientObjects(object: entity.Object) {
  const ingredientRecipes = object.ingredientFor || [];
  return sortBy(
    ingredientRecipes.map(r => r.object),
    'name'
  );
}

const ObjectPage: React.FunctionComponent = () => {
  const { objectId } = useParams<Params>();
  const { error, isLoading, result } = useGraphql<ObjectResult>(query, {
    objectId,
  });
  const object = get(result, 'object');
  if (!object) {
    return null;
  }
  return (
    <Entity className="object" error={error} isLoading={isLoading}>
      <EntityName name={object.name} />
      <EntitySubheader text={object.subtype} />
      <ObjectHere link={false} plural={false} object={object} />
      <ObjectHere link={false} plural={true} object={object} />
      <EntitySection title="Description">
        <Descriptions object={object} />
      </EntitySection>
      <Row>
        <BasicInfo object={object} />
        <WearableInfo object={object} />
        <SpecialInfo object={object} />
      </Row>
      <EntitySection title="Source">
        <Row>
          <Mobs mobs={object.mobs} />
          <Rooms rooms={object.rooms} />
          <Recipes recipes={object.recipes} />
        </Row>
      </EntitySection>
      <EntitySection
        title="Ingredient For"
        visible={!isEmpty(object.ingredientFor)}
      >
        <Objects objects={ingredientObjects(object)} />
      </EntitySection>
      <Metadata object={object} />
    </Entity>
  );
};

export default ObjectPage;
