import React from 'react';
import * as entity from '../../../../../types/entity';
import { get } from 'lodash';
import { useParams } from 'react-router-dom';
import { useGraphql } from '../../../../../hooks';
import List from '../../../../common/List';
import {
  Entity,
  EntityDescription,
  EntityName,
  EntitySubheader,
} from '../../../../entity';
import Exit from './Exit';
import Spawn from './Spawn';

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
    }
  }
}`;

const RoomPage: React.FunctionComponent = () => {
  const { roomId } = useParams<Params>();
  const { error, isLoading, result } = useGraphql<RoomResult>(query, {
    roomId,
  });
  const room = get(result, 'room');
  return (
    <Entity className="room" error={error} isLoading={isLoading}>
      <EntityName name={get(room, 'name', 'n/a')} />
      <EntitySubheader text={get(room, 'area')} />
      <EntityDescription description={get(room, 'description')} />
      <List<entity.Exit> className="exits" items={get(room, 'exits', [])}>
        {exit => {
          return <Exit exit={exit} key={exit.dir} />;
        }}
      </List>
      <List<entity.Spawn> className="spawns" items={get(room, 'spawns', [])}>
        {(spawn, index) => {
          return <Spawn spawn={spawn} key={index} />;
        }}
      </List>
    </Entity>
  );
};

export default RoomPage;
