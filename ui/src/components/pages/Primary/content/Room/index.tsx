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

interface RoomResult {
  room: entity.Room;
}

interface Params {
  roomId: string;
}

const query = `query Room($roomId: String) {
  room(id: $roomId) {
    area
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
    name
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
    spawns {
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
        name
      }
      position
    }
  }
}`;

function isInventorySpawn(spawn: entity.Spawn) {
  return spawn.position === 'inventory';
}

function shopInventory(spawns: entity.Spawn[]) {
  const objects: entity.Object[] = [];
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
  const spawns = get(room, 'spawns', []).filter(
    spawn => !isInventorySpawn(spawn)
  );
  const shopInventoryObjects = shopInventory(room.spawns);
  return (
    <Entity className="room" error={error} isLoading={isLoading}>
      <EntityName name={get(room, 'name', 'n/a')} />
      <EntitySubheader text={get(room, 'area')} />
      <EntityDescription description={get(room, 'description')} />
      <List<entity.Exit> className="exits" items={get(room, 'exits', [])}>
        {exit => {
          return <Exit exit={exit} />;
        }}
      </List>
      <Spawns spawns={spawns} />
      <EntitySection
        title="Shop Inventory"
        visible={!isEmpty(shopInventoryObjects)}
      >
        <Objects objects={shopInventoryObjects} />
      </EntitySection>
      <Custom room={room} />
    </Entity>
  );
};

export default RoomPage;
