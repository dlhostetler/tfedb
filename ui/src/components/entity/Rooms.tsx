import React from 'react';
import { isEmpty } from 'lodash';
import * as entity from '../../types/entity';
import List from '../layout/List';
import EntityLink from '../links/EntityLink';

interface Props {
  className?: string;
  rooms: entity.Room[];
}

function Rooms(props: Props) {
  const { rooms } = props;
  if (isEmpty(rooms)) {
    return null;
  }
  return (
    <List<entity.Room> items={rooms}>
      {room => (
        <EntityLink id={room.id} type="room">
          {room.name}
        </EntityLink>
      )}
    </List>
  );
}

export default Rooms;
