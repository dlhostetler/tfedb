import React from 'react';
import { isEmpty } from 'lodash';
import * as entity from '../../types/entity';
import List from '../layout/List';
import EntityLink from '../links/EntityLink';

interface Props {
  className?: string;
  mobs: entity.Mob[];
}

function Mobs(props: Props) {
  const { mobs } = props;
  if (isEmpty(mobs)) {
    return null;
  }
  return (
    <List<entity.Mob> items={mobs}>
      {mob => (
        <EntityLink id={mob.id} type="mob">
          {mob.name || mob.appearance}
        </EntityLink>
      )}
    </List>
  );
}

export default Mobs;
