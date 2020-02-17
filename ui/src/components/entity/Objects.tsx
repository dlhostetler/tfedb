import React from 'react';
import { isEmpty, sortBy } from 'lodash';
import classnames from 'classnames';
import * as entity from '../../types/entity';
import List from '../layout/List';
import EntityLink from '../links/EntityLink';

interface Props {
  className?: string;
  objects: entity.Object[];
}

function Objects(props: Props) {
  let { className, objects } = props;
  if (isEmpty(objects)) {
    return null;
  }
  objects = sortBy(objects, 'name');
  return (
    <List<entity.Object>
      className={classnames('objects', className)}
      items={objects}
    >
      {object => (
        <EntityLink id={object.id} type="object">
          {object.name}
        </EntityLink>
      )}
    </List>
  );
}

export default Objects;
