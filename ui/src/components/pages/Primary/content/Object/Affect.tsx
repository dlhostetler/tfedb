import React from 'react';
import { get } from 'lodash';
import classnames from 'classnames';
import * as entity from '../../../../../types/entity';

interface Props {
  affect: entity.Affect;
  className?: string;
}

function sign(affect: entity.Affect) {
  if (affect.amount < 0) {
    return '-';
  }
  return '+';
}

const humanizedAffects = {
  acid: 'Resist acid',
  age: 'Age',
  armor: 'AC',
  cold: 'Resist cold',
  constitution: 'Constitution',
  damroll: 'Damage roll',
  dexterity: 'Dexterity',
  electricity: 'Resist electricity',
  fire: 'Resist fire',
  hit_regen: 'Hitpoint regen',
  hitroll: 'Hit roll',
  hp: 'Hitpoints',
  intelligence: 'Intelligence',
  magic: 'Resist magic',
  mana: 'Mana',
  mana_regen: 'Mana regen',
  mind: 'Mind',
  move: 'Move',
  move_regen: 'Move regen',
  poison: 'Resist poison',
  strength: 'Strength',
  wisdom: 'Wisdom',
};

function humanizeAffect(affect: string) {
  return get(humanizedAffects, affect, 'Unknown affect');
}

function Affect(props: Props) {
  const { affect, className } = props;
  return (
    <div className={classnames('affect', className)}>
      {`${humanizeAffect(affect.type)} by ${sign(affect)}${Math.abs(
        affect.amount
      )}`}
    </div>
  );
}

export default Affect;
