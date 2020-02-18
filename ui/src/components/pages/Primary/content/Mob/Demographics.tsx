import React from 'react';
import * as entity from '../../../../../types/entity';
import Table from '../../../../layout/Table';
import NamedValue from '../../../../layout/NamedValue';
import TitledBorder from '../../../../layout/TitledBorder';

interface Props {
  className?: string;
  mob: entity.Mob;
}

function Demographics(props: Props) {
  const { mob } = props;
  return (
    <TitledBorder title="Demographics">
      <Table>
        <NamedValue name="Adult" value={mob.adult} />
        <NamedValue name="Alignment" value={mob.alignment.name} />
        <NamedValue name="Group" value={mob.group.name} />
        <NamedValue name="Maturity" value={mob.maturity} />
        <NamedValue name="Nation" value={mob.nation.name} />
        <NamedValue name="Race" value={mob.race.name} />
        <NamedValue name="Sex" value={mob.sex} />
        <NamedValue name="Size" value={mob.size} />
        <NamedValue name="Weight" value={mob.weight} />
      </Table>
    </TitledBorder>
  );
}

export default Demographics;
