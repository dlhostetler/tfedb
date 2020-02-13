export interface Affect {
  amount: number;
  type: string;
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
  affects: Affect[];
  herePrefix: string;
  hereSuffix: string;
  id: string;
  mobs: Mob[];
  name: string;
  spawnType: string;
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
