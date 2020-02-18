import React from 'react';
import * as entity from '../../../../../types/entity';
import Table from '../../../../layout/Table';
import NamedValue from '../../../../layout/NamedValue';
import { EntitySection } from '../../../../entity';

interface Props {
  className?: string;
  mob: entity.Mob;
}

function Metadata(props: Props) {
  const { mob } = props;
  return (
    <EntitySection title="Metadata">
      <Table>
        <NamedValue name="Creator" value={mob.creator} />
      </Table>
    </EntitySection>
  );
}

export default Metadata;
