import React from 'react';
import { get, isEmpty } from 'lodash';
import * as entity from '../../../../../types/entity';
import List from '../../../../layout/List';
import Spawn from './Spawn';
import Objects from '../../../../entity/Objects';

interface Props {
  className?: string;
  spawns: entity.Spawn[];
}

interface ExtendedSpawn extends entity.Spawn {
  child?: JSX.Element | null;
}

function insideObjects(
  spawns: entity.Spawn[],
  from: number,
  extendedSpawn: ExtendedSpawn
) {
  const objects: entity.Object[] = [];
  let i;
  for (i = from; i < spawns.length; i++) {
    const spawn = spawns[i];
    if (!spawn.object || !spawn.flags.includes('inside')) {
      break;
    }
    objects.push(spawn.object);
  }
  extendedSpawn.child = <Objects className="insides" objects={objects} />;
  return i;
}

function extendSpawns(spawns: entity.Spawn[]): ExtendedSpawn[] {
  const extendedSpawns: ExtendedSpawn[] = [];
  for (let i = 0; i < spawns.length; i++) {
    const extendedSpawn: ExtendedSpawn = spawns[i];
    if (extendedSpawn.flags.includes('container')) {
      i += insideObjects(spawns, i + 1, extendedSpawn);
    }
    extendedSpawns.push(extendedSpawn);
  }
  return extendedSpawns;
}

function Spawns(props: Props) {
  if (isEmpty(props.spawns)) {
    return null;
  }
  const spawns = extendSpawns(props.spawns);
  return (
    <List<ExtendedSpawn> className="spawns" items={spawns}>
      {spawn => {
        return <Spawn spawn={spawn}>{spawn.child}</Spawn>;
      }}
    </List>
  );
}

export default Spawns;
