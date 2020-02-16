import React from 'react';
import classnames from 'classnames';
import { get } from 'lodash';

interface Props {
  className?: string;
  flag: string;
}

const humanizedFlags = {
  additive: 'Affects are additive',
  appraised: 'Has been appraised',
  backstab: 'Can backstab',
  body_part: 'Body part (available through skinning)',
  burning: 'Burning',
  chair: 'Can be sat on',
  copied: 'Copied',
  cover: 'Cover?',
  dark: 'Dark',
  evil: 'Is Evil',
  flaming: 'Flaming',
  glow: 'Glows',
  good: 'Good',
  hum: 'Hums',
  identified: 'Has been identified',
  inventory: 'Has an inventory?',
  is_invis: 'Invisible',
  known_liquid: 'Liquid Identified',
  lock: 'Can be locked',
  magic: 'Is Magic',
  no_auction: 'Cannot be auctioned',
  no_disarm: 'Cannot be disarmed',
  no_enchant: 'Cannot be enchanted',
  no_junk: 'Cannot be junked',
  no_major: 'No major...enchants?',
  no_sell: 'Cannot be sold',
  no_shield: 'Is not a shield?',
  nodrop: 'Cannot be dropped',
  noremove: 'Cannot be removed',
  nosacrifice: 'Cannot be sacrificed',
  nosave: 'Will not be saved',
  noshow: 'Will not be shown in a room?',
  poison_coated: 'Poison-coated',
  random_metal: 'Random Metal',
  replicate: 'Replicates',
  rust_proof: 'Rustproof',
  sanct: 'Sanctuary',
  the: 'The?',
  two_hand: 'Two-handed',
  water_proof: 'Waterproof',
};

function humanizeFlag(flag: string) {
  return get(humanizedFlags, flag, 'Unknown Flag');
}

function Flag(props: Props) {
  const { className, flag } = props;
  return (
    <div className={classnames('flag', className)}>{`${humanizeFlag(
      flag
    )}.`}</div>
  );
}

export default Flag;
