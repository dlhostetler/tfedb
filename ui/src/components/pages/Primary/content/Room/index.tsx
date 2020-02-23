import React from 'react';
import * as entity from '../../../../../types/entity';
import { get, isEmpty } from 'lodash';
import { useParams } from 'react-router-dom';
import { useGraphql } from '../../../../../hooks';
import List from '../../../../layout/List';
import {
  Entity,
  EntityDescription,
  EntityName,
  EntitySection,
  EntitySubheader,
} from '../../../../entity';
import Exit from './Exit';
import Objects from '../../../../entity/Objects';
import Spawns from './Spawns';
import Custom from './Custom';
import Poi from './Poi';
import Action from './Action';
import Metadata from './Metadata';
import Info from './Info';
import { Title } from '../../../../common/Title';

interface RoomResult {
  room: entity.Room;
}

interface Params {
  roomId: string;
}

const query = `query Room($roomId: String) {
  room(id: $roomId) {
    actions {
      script {
        code
        descriptions {
          placeholder
          value
        }
        type
      }
      targets
      trigger
      verbs
    }
    area
    author
    comments
    description
    exits {
      dir
      fromRoom {
        id
        name
      }
      key {
        id
        name
      }
      light
      size
      strength
      toRoom {
        id
        name
      }
    }
    flags
    level
    name
    pois {
      description
      keywords
    }
    recipes {
      ingredients {
        numRequired
        object {
          id
          name
        }
      }
      object {
        id
        name
      }
    }
    sector
    size
    spawns {
      flags
      liquid {
        id
        name
      }
      mob {
        appearance
        herePrefix
        hereSuffix
        id
        name
      }
      object {
        herePrefix
        hereSuffix
        id
        key {
          id
          name
        }
        name
        subtype
      }
      position
    }
    status
  }
}`;

function isInventorySpawn(spawn: entity.Spawn) {
  return spawn.position === 'inventory';
}

function shopInventory(spawns: entity.Spawn[]) {
  const objects: entity.Object[] = [];
  if (!spawns) {
    return objects;
  }
  for (const spawn of spawns) {
    if (isInventorySpawn(spawn) && spawn.object) {
      objects.push(spawn.object);
    }
  }
  return objects;
}

const RoomPage: React.FunctionComponent = () => {
  const { roomId } = useParams<Params>();
  const { error, isLoading, result } = useGraphql<RoomResult>(query, {
    roomId,
  });
  const room = get(result, 'room');
  if (!room) {
    return null;
  }
  let spawns = room.spawns || [];
  spawns = spawns.filter(spawn => !isInventorySpawn(spawn));
  const shopInventoryObjects = shopInventory(room.spawns);
  return (
    <Entity className="room" error={error} isLoading={isLoading}>
      <Title text={[roomId, room.name, 'room  ']} />
      <EntityName name={get(room, 'name', 'n/a')} />
      <EntitySubheader text={get(room, 'area')} />
      <EntityDescription description={get(room, 'description')} />
      <List<entity.Exit> className="exits" items={get(room, 'exits', [])}>
        {exit => {
          return <Exit exit={exit} />;
        }}
      </List>
      <Spawns spawns={spawns} />
      <Info room={room} />
      <EntitySection
        title="Shop Inventory"
        visible={!isEmpty(shopInventoryObjects)}
      >
        <Objects objects={shopInventoryObjects} />
      </EntitySection>
      <Custom room={room} />
      <EntitySection title="Actions">
        <List<entity.Action>
          className="actions"
          items={get(room, 'actions', [])}
        >
          {action => {
            return <Action action={action} />;
          }}
        </List>
      </EntitySection>
      <EntitySection title="Points of Interest">
        <List<entity.Poi> className="pois" items={get(room, 'pois', [])}>
          {poi => {
            return <Poi poi={poi} />;
          }}
        </List>
      </EntitySection>
      <Metadata room={room} />
    </Entity>
  );
};

export default RoomPage;
