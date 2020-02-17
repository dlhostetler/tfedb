import React from 'react';
import * as entity from '../../../../../types/entity';
import Table from '../../../../layout/Table';
import NamedValue from '../../../../layout/NamedValue';
import { EntitySection } from '../../../../entity';

interface Props {
  className?: string;
  room: entity.Room;
}

function Metadata(props: Props) {
  const { room } = props;
  return (
    <EntitySection title="Metadata">
      <Table>
        <NamedValue name="Author" value={room.author} />
        <NamedValue name="Comments">
          <pre>{room.comments}</pre>
        </NamedValue>
        <NamedValue name="Status" value={room.status} />
      </Table>
    </EntitySection>
  );
}

export default Metadata;
