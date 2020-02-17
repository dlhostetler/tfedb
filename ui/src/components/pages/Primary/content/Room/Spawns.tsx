import React from 'react';
import { isEmpty } from 'lodash';
import * as entity from '../../../../../types/entity';
import List from '../../../../layout/List';
import Spawn from './Spawn';

interface Props {
  className?: string;
  spawns: entity.Spawn[];
}

function adjustSuffix(spawn: entity.Spawn, containerName: string) {
  if (!spawn.object) {
    return spawn;
  }
  if (spawn.flags.includes('inside') && containerName) {
    spawn.object.hereSuffix = `is contained in a ${containerName}`;
  }
  return spawn;
}

function getContainerName(
  spawn: entity.Spawn,
  lastContainerName: string
): string {
  if (!spawn.object || !spawn.flags.includes('container')) {
    return lastContainerName;
  }
  return spawn.object.name;
}

function Spawns(props: Props) {
  const { spawns } = props;
  if (isEmpty(spawns)) {
    return null;
  }
  let containerName = '';
  return (
    <List<entity.Spawn> className="spawns" items={spawns}>
      {spawn => {
        containerName = getContainerName(spawn, containerName);
        return <Spawn spawn={adjustSuffix(spawn, containerName)} />;
      }}
    </List>
  );
}

export default Spawns;
