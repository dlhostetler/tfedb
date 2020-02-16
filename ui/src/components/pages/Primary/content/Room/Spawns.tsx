import React from 'react';
import { isEmpty } from 'lodash';
import * as entity from '../../../../../types/entity';
import List from '../../../../layout/List';
import Spawn from './Spawn';

interface Props {
  className?: string;
  spawns: entity.Spawn[];
}

function Spawns(props: Props) {
  const { spawns } = props;
  if (isEmpty(spawns)) {
    return null;
  }
  return (
    <List<entity.Spawn> className="spawns" items={spawns}>
      {spawn => {
        return <Spawn spawn={spawn} />;
      }}
    </List>
  );
}

export default Spawns;
