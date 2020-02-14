import React from 'react';
import classnames from 'classnames';
import * as entity from '../../../../../types/entity';

interface Props {
  affect: entity.Affect;
  className?: string;
}

function sign(affect: entity.Affect) {
  if (affect.amount < 0) {
    return '-';
  }
  return '+';
}

function Affect(props: Props) {
  const { affect, className } = props;
  return (
    <div className={classnames('affect', className)}>
      <span>{affect.type}</span>
      by
      <span>{sign(affect)}</span>
      <span>{Math.abs(affect.amount)}</span>
    </div>
  );
}

export default Affect;
