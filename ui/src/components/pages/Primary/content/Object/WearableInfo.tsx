import React from 'react';
import { pull } from 'lodash';
import * as entity from '../../../../../types/entity';
import Table from '../../../../layout/Table';
import NamedValue from '../../../../layout/NamedValue';
import TitledBorder from '../../../../layout/TitledBorder';
import { prettyDice } from '../../../../../format/dice';
import { arrayToString } from '../../../../../format/array';
import Anti from './Anti';

interface Props {
  className?: string;
  object: entity.Object;
}

function WearableInfo(props: Props) {
  const { object } = props;
  return (
    <TitledBorder title="Wearable">
      <Table>
        <NamedValue name="AC" value={object.ac} />
        <NamedValue name="Attack" value={object.attack} />
        <NamedValue name="Blocks" value={object.blocks} />
        <NamedValue name="Capacity" value={object.capacity} />
        <NamedValue name="Charges" value={object.charges} />
        <NamedValue name="Damage" value={prettyDice(object.damage)} />
        <NamedValue name="Enchantment" value={object.enchantment} />
        <NamedValue name="Global AC" value={object.acGlobal} />
        <NamedValue name="Layer" value={object.layers.join(', ')} />
        <NamedValue name="Repair" value={object.repair} />
        <NamedValue
          name="Slot"
          value={arrayToString(pull(object.wearLocations, 'take'))}
        />
      </Table>
      <Anti anti={object.anti} />
    </TitledBorder>
  );
}

export default WearableInfo;
