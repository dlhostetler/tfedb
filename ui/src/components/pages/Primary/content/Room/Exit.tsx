import React from 'react';
import classnames from 'classnames';
import * as entity from '../../../../../types/entity';
import EntityLink from '../../../../links/EntityLink';

interface Props {
  className?: string;
  exit: entity.Exit;
}

function Exit(props: Props) {
  const { className, exit } = props;
  return (
    <div className={classnames('exit', className)}>
      <span className="direction">{exit.dir}</span>
      <span className="separator"> - </span>
      <EntityLink className="link" id={exit.toRoom.id} type="room">
        {exit.toRoom.name}
      </EntityLink>
    </div>
  );
}

export default Exit;
