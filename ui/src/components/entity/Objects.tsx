import React from 'react';
import { isEmpty } from 'lodash';
import * as entity from '../../types/entity';
import List from '../layout/List';
import EntityLink from '../links/EntityLink';

interface Props {
  className?: string;
  objects: entity.Object[];
}

function Objects(props: Props) {
  const { objects } = props;
  if (isEmpty(objects)) {
    return null;
  }
  return (
    <List<entity.Object> items={objects}>
      {object => (
        <EntityLink id={object.id} type="object">
          {object.name}
        </EntityLink>
      )}
    </List>
  );
}

export default Objects;
