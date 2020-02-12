import React from 'react';
import * as entity from '../../../../../types/entity';
import { get } from 'lodash';
import { useParams } from 'react-router-dom';
import { useGraphql } from '../../../../../hooks';
import List from '../../../../common/List';
import Entity from '../../../../entity/Entity';
import EntityName from '../../../../entity/EntityName';
import EntityDescription from '../../../../entity/EntityDescription';
import Exit from './Exit';

interface RoomResult {
  room: entity.Room;
}

interface Params {
  roomId: string;
}

const query = `query Room($roomId: String) {
  room(id: $roomId) {
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
      <EntityDescription description={get(room, 'description')} />
      <List<entity.Exit> className="exits" items={get(room, 'exits', [])}>
        {exit => {
          return <Exit exit={exit} key={exit.dir} />;
        }}
      </List>
    </Entity>
  );
};

export default RoomPage;
