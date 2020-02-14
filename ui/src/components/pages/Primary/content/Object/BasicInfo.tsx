import React from 'react';
import * as entity from '../../../../../types/entity';
import TitledBorder from '../../../../layout/TitledBorder';
import Table from '../../../../layout/Table';
import NamedValue from '../../../../layout/NamedValue';

interface Props {
  className?: string;
  object: entity.Object;
}

function BasicInfo(props: Props) {
  const { object } = props;
  return (
    <TitledBorder title="Info">
      <Table>
        <NamedValue name="Cost" value={object.cost} />
        <NamedValue name="Durability" value={object.durability} />
        <NamedValue name="Light" value={object.light} />
        <NamedValue name="Limit" value={object.limit} />
        <NamedValue name="Materials" value={object.materials.join(', ')} />
        <NamedValue name="Nourishment" value={object.nourishment} />
        <NamedValue name="Repair" value={object.repair} />
        <NamedValue name="Size" value={object.size} />
        <NamedValue name="Weight" value={object.weight} />
      </Table>
    </TitledBorder>
  );
}

export default BasicInfo;
