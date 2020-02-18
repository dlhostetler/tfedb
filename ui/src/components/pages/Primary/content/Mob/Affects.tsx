import React from 'react';
import classnames from 'classnames';
import { get, isEmpty } from 'lodash';
import { arrayToString } from '../../../../../format/array';

interface Props {
  className?: string;
  affects: string[];
}

const humanizedAffect = {
  armor: 'Armor',
  axe_prof: 'Axe Proficiency',
  barkskin: 'Barkskin',
  bless: 'Bless',
  blind: 'Blind',
  bow_prof: 'Bow Proficiency',
  camouflage: 'Camouflage',
  chill: 'Chill',
  choking: 'Choking',
  confused: 'Confused',
  continual_light: 'Continual Light',
  curse: 'Curse',
  death: 'Death',
  detect_evil: 'Detect Evil',
  detect_good: 'Detect Good',
  detect_hidden: 'Detect Hidden',
  detect_magic: 'Detect Magic',
  displace: 'Displace',
  entangled: 'Entangled',
  faerie_fire: 'Faerie Fire',
  fire_shield: 'Fire Shield',
  float: 'Float',
  fly: 'Fly',
  hallucinate: 'Hallucinate',
  haste: 'Hate',
  hide: 'Hide',
  infrared: 'Infrared',
  invisible: 'Invisible',
  invulnerability: 'Invulnerability',
  ion_shield: 'Ion Shield',
  life_saving: 'Life Saving',
  light_sensitive: 'Light Sensitive',
  ogre_strength: 'Ogre Strength',
  paralysis: 'Paralysis',
  pass_door: 'Pass Door',
  plague: 'Plague',
  poison: 'Poison',
  prot_plants: 'Protection Plants',
  protect: 'Protect',
  protect_evil: 'Protection from Evil',
  protect_good: 'Protection from Good',
  rabies: 'Rabies',
  regeneration: 'Regeneration',
  resist_acid: 'Resist Acid',
  resist_cold: 'Resist Cold',
  resist_fire: 'Resist Fire',
  resist_poison: 'Resist Poison',
  resist_shock: 'Resist Shock',
  sanctuary: 'Sanctuary',
  see_camouflage: 'See Camouflage',
  see_invis: 'See Invisible',
  sense_danger: 'Sense Danger',
  sense_life: 'Sense Life',
  silence: 'Silence',
  sleep: 'Sleep',
  sleep_resist: 'Sleep Resist',
  slow: 'Slow',
  sneak: 'Sneak',
  speed: 'Speed',
  sword_prof: 'Sword Proficiency',
  thorn_shield: 'Thorn Shield',
  tomb_rot: 'Tomb Rot',
  tongues: 'Tongues',
  true_sight: 'True Sight',
  unused: 'Unused',
  vitality: 'Vitality',
  water_breathing: 'Water Breathing',
  water_walking: 'Water Walking',
  wrath: 'Wrath',
};

function humanizeAffect(affect: string) {
  return get(humanizedAffect, affect, 'Unknown');
}

function Affects(props: Props) {
  const { affects, className } = props;
  if (isEmpty(affects)) {
    return null;
  }
  const affectsList = affects.map(humanizeAffect);
  affectsList.sort();
  return (
    <div
      className={classnames('affects', className)}
    >{`Affected by: ${arrayToString(affectsList)}`}</div>
  );
}

export default Affects;
