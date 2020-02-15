import React from 'react';
import * as entity from '../../../../../types/entity';
import Table from '../../../../layout/Table';
import NamedValue from '../../../../layout/NamedValue';

interface Props {
  className?: string;
  object: entity.Object;
}

function Metadata(props: Props) {
  const { object } = props;
  return (
    <Table>
      <NamedValue name="Created by" value={object.creator} />
      <NamedValue name="Updated by" value={object.updater} />
    </Table>
  );
}

export default Metadata;
