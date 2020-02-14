export interface Affect {
  amount: number;
  type: string;
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
  damage: Dice;
  durability: number;
  enchantment: number;
  flags: string[];
  halflife: number;
  herePrefix: string;
  hereSuffix: string;
  id: string;
  key: Object;
  layers: string[];
  light: number;
  limit: number;
  materials: string[];
  mobs: Mob[];
  name: string;
  nourishment: number;
  repair: number;
  size: number;
  subtype: string;
  unlocksContainers: Object[];
  unlocksExits: Exit[];
  wearLocations: string[];
  weight: number;
}

export interface Race {
  name: string;
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
