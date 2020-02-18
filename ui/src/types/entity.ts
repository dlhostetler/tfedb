export interface Action {
  script: Script;
  targets: string;
  trigger: string;
  verbs: string;
}

export interface Affect {
  amount: number;
  type: string;
}

export interface Alignment {
  id: string;
  name: string;
}

export interface Armor {
  armor: string;
  chance: number;
  name: string;
}

export interface Attribute {
  type: string;
  value: number;
}

export interface Description {
  keywords: string;
  description: string;
}

export interface Dice {
  number: number;
  plus?: number;
  sides?: number;
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

export interface Group {
  id: string;
  name: string;
}

export interface Ingredient {
  numRequired: number;
  object: Object;
}

export interface Liquid {
  id: string;
  name: string;
}

export interface Mob {
  adult: number;
  affects: string[];
  alignment: Alignment;
  appearance: string;
  appearancePlural: string;
  armor: Armor[];
  attributes: Attribute[];
  attacks: Script;
  corpse: Object;
  creator: string;
  description: string;
  dice: MobDice[];
  gold: number;
  group: Group;
  herePluralPrefix: string;
  herePluralSuffix: string;
  herePrefix: string;
  hereSuffix: string;
  id: string;
  keywords: string;
  level: number;
  maturity: number;
  name: string;
  nation: Nation;
  objects: Mobject[];
  race: Race;
  resists: Resist[];
  rooms: Room[];
  scripts: Script[];
  sex: string;
  size: string;
  skeleton: Mob;
  weight: number;
  zombie: Mob;
}

export interface MobDice {
  dice: Dice;
  purpose: string;
}

export interface Mobject {
  object: Object;
}

export interface Nation {
  id: string;
  name: string;
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

export interface Poi {
  description: string;
  keywords: string;
}

export interface Race {
  id: string;
  name: string;
}

export interface Recipe {
  id: string;
  ingredients: Ingredient[];
  mob: Mob;
  object: Object;
  room: Room;
}

export interface Resist {
  type: string;
  value: number;
}

export interface Room {
  actions: Action[];
  area: string;
  author: string;
  comments: string;
  description?: string;
  exits: Exit[] | null;
  flags: string[];
  level: number;
  id: string;
  name: string;
  pois: Poi[];
  recipes: Recipe[];
  sector: string;
  size: string;
  spawns: Spawn[];
  status: string;
}

export interface Script {
  code: string;
  descriptions: ScriptDescription[];
  type: string;
}

export interface ScriptDescription {
  placeholder: string;
  value: string;
}

export interface Spawn {
  flags: string[];
  liquid: Liquid | null;
  mob: Mob | null;
  object: Object | null;
  position: string;
}
