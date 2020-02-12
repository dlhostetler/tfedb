export interface Exit {
  dir: string;
  fromRoom: Room;
  key: Object;
  light: number;
  size: number;
  strength: number;
  toRoom: Room;
}

export interface Object {
  id: string;
  name: string;
}

export interface Room {
  description?: string;
  exits: Exit[] | null;
  id: string;
  name: string;
}
