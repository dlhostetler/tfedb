import React from 'react';
import classnames from 'classnames';
import { isEmpty, sortBy } from 'lodash';
import * as entity from '../../../../../types/entity';

interface Props {
  className?: string;
  resists: entity.Resist[];
}

function prettyResist(resist: entity.Resist) {
  const { type, value } = resist;
  return `${type} ${value}`;
}

function prettyResists(resists: entity.Resist[]) {
  return sortBy(resists, 'type')
    .map(prettyResist)
    .join(' ');
}

function Resists(props: Props) {
  const { className, resists } = props;
  if (isEmpty(resists)) {
    return null;
  }
  return (
    <div className={classnames('resists', className)}>
      {prettyResists(resists)}
    </div>
  );
}

export default Resists;
