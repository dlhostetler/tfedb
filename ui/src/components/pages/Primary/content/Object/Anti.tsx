import React from 'react';
import classnames from 'classnames';
import { get, isEmpty } from 'lodash';
import { arrayToString } from '../../../../../format/array';

interface Props {
  className?: string;
  anti: string[];
}

const humanizedAnti = {
  anti_centaur: 'Centaur',
  anti_chaotic: 'Chaotic',
  anti_dwarf: 'Dwarf',
  anti_elf: 'Elf',
  anti_ent: 'Ent',
  anti_evil: 'Evil',
  anti_gnome: 'Gnome',
  anti_goblin: 'Goblin',
  anti_good: 'Good',
  anti_halfling: 'Halfling',
  anti_human: 'Human',
  anti_lawful: 'Lawful',
  anti_lizard: 'Lizardman',
  anti_mage: 'Mage',
  anti_monk: 'Monk',
  anti_neutral: 'Neutral',
  anti_ogre: 'Ogre',
  anti_orc: 'Orc',
  anti_psionic: 'Psionic',
  anti_troll: 'Troll',
  anti_unused1: 'Unused',
  anti_unused2: 'Unused',
  anti_unused3: 'Unused',
  anti_vyan: 'Vyan',
};

function humanizeAnti(anti: string) {
  return get(humanizedAnti, anti, 'Unknown');
}

function Anti(props: Props) {
  const { anti, className } = props;
  if (isEmpty(anti)) {
    return null;
  }
  const antiList = anti.map(humanizeAnti);
  antiList.sort();
  return (
    <div
      className={classnames('anti', className)}
    >{`Cannot be used by: ${arrayToString(antiList)}`}</div>
  );
}

export default Anti;
