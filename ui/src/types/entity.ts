export interface Affect {
  amount: number;
  type: string;
}

export interface Description {
  keywords: string;
  description: string;
}

export interface Dice {
  number: number;
  plus: number;
  sides: number;
}

export interface Exit {
  dir: string;
  fromRoom: Room;
  key: Object;
  light: number;
  size: number;
  strength: number;
  toRoom: Room;
}

export interface Mob {
  appearance: string;
  description: string;
  herePrefix: string;
  hereSuffix: string;
  id: string;
  name: string;
  race: Race;
  rooms: Room[];
}

export interface Object {
  ac: number;
  acGlobal: number;
  affects: Affect[];
  anti: string[];
  attack: number;
  blocks: number;
  capacity: number;
  charges: number;
  cost: number;
  creator: string;
  damage: Dice;
  descriptions: Description[];
  durability: number;
  enchantment: number;
  flags: string[];
  halflife: number;
  herePluralPrefix: string;
  herePluralSuffix: string;
  herePrefix: string;
  hereSuffix: string;
  id: string;
  ingredientFor: Recipe[];
  key: Object;
  layers: string[];
  light: number;
  limit: number;
  materials: string[];
  mob: Mob;
  mobs: Mob[];
  name: string;
  namePlural: string;
  nourishment: number;
  recipes: Recipe[];
  repair: number;
  restriction: string;
  rooms: Room[];
  size: number;
  subtype: string;
  unlocksContainers: Object[];
  unlocksExits: Exit[];
  updater: string;
  wearLocations: string[];
  weight: number;
}

export interface Race {
  name: string;
}

export interface Recipe {
  id: string;
  mob: Mob;
  object: Object;
  room: Room;
}

export interface Room {
  area: string;
  description?: string;
  exits: Exit[] | null;
  id: string;
  name: string;
  spawns: Spawn[];
}

export interface Spawn {
  mob: Mob | null;
  object: Object | null;
}
