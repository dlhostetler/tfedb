import React from 'react';
import * as entity from '../../../../../types/entity';
import { get } from 'lodash';
import { useParams } from 'react-router-dom';
import { useGraphql } from '../../../../../hooks';
import List from '../../../../layout/List';
import {
  Entity,
  EntityName,
  EntitySection,
  EntitySubheader,
} from '../../../../entity';
import EntityLink from '../../../../links/EntityLink';
import Row from '../../../../layout/Row';
import TitledBorder from '../../../../layout/TitledBorder';
import Table from '../../../../layout/Table';
import NamedValue from '../../../../layout/NamedValue';
import WearableInfo from './WearableInfo';
import SpecialInfo from './SpecialInfo';
import BasicInfo from './BasicInfo';

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
    blocks
    capacity
    charges
    cost
    damage {
      number
      plus sides
    }
    durability
    enchantment
    flags
    halflife
    key {
      id
      name
    }
    layers
    light
    limit
    mobs {
      appearance
      id
      name
    }
    materials
    name
    nourishment
    repair
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
    wearLocations
    weight
  }
}`;

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
      <Row>
        <BasicInfo object={object} />
        <WearableInfo object={object} />
        <SpecialInfo object={object} />
      </Row>
      <EntitySection title="Mobs">
        <List<entity.Mob> items={get(object, 'mobs', [])}>
          {mob => (
            <EntityLink id={mob.id} key={mob.id} type="mob">
              {mob.name || mob.appearance}
            </EntityLink>
          )}
        </List>
      </EntitySection>
    </Entity>
  );
};

export default ObjectPage;
