import React from 'react';
import * as entity from '../../../../../types/entity';
import Table from '../../../../layout/Table';
import NamedValue from '../../../../layout/NamedValue';
import { EntitySection } from '../../../../entity';

interface Props {
  className?: string;
  object: entity.Object;
}

function Metadata(props: Props) {
  const { object } = props;
  return (
    <EntitySection title="Metadata">
      <Table>
        <NamedValue name="Created by" value={object.creator} />
        <NamedValue name="Updated by" value={object.updater} />
      </Table>
    </EntitySection>
  );
}

export default Metadata;
