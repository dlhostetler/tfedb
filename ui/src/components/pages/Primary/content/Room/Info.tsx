import React from 'react';
import * as entity from '../../../../../types/entity';
import Table from '../../../../layout/Table';
import NamedValue from '../../../../layout/NamedValue';
import { EntitySection } from '../../../../entity';
import { arrayToString } from '../../../../../format/array';

interface Props {
  className?: string;
  room: entity.Room;
}

function Info(props: Props) {
  const { room } = props;
  return (
    <EntitySection title="Info">
      <Table>
        <NamedValue name="Flags" value={arrayToString(room.flags)} />
        <NamedValue name="Level" value={room.level} />
        <NamedValue name="Sector" value={room.sector} />
        <NamedValue name="Size" value={room.size} />
      </Table>
    </EntitySection>
  );
}

export default Info;
