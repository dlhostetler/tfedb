import React from 'react';
import * as entity from '../../../../../types/entity';
import Table from '../../../../layout/Table';
import NamedValue from '../../../../layout/NamedValue';
import TitledBorder from '../../../../layout/TitledBorder';
import { prettyDice } from '../../../../../format/dice';
import Attributes from './Attributes';
import Resists from './Resists';
import Affects from './Affects';
import EntityLink from '../../../../links/EntityLink';

interface Props {
  className?: string;
  mob: entity.Mob;
}

function findDice(allDice: entity.MobDice[], purpose: string): entity.Dice {
  const mobDice = allDice.find(d => d.purpose === purpose);
  if (!mobDice) {
    return { number: 0 };
  }
  return mobDice.dice;
}

function Combat(props: Props) {
  const { mob } = props;
  return (
    <TitledBorder title="Combat">
      <Table>
        <NamedValue name="Level" value={mob.level} />
        <NamedValue name="Copper" value={mob.gold} />
        {mob.corpse && (
          <NamedValue name="Corpse">
            <EntityLink id={mob.corpse.id} type="object">
              {mob.corpse.name}
            </EntityLink>
          </NamedValue>
        )}
        <NamedValue
          name="Hitpoints"
          value={prettyDice(findDice(mob.dice, 'hp'))}
        />
        <NamedValue
          name="Movement"
          value={prettyDice(findDice(mob.dice, 'movement'))}
        />
      </Table>
      <Attributes attributes={mob.attributes} />
      <Resists resists={mob.resists} />
      <Affects affects={mob.affects} />
    </TitledBorder>
  );
}

export default Combat;
