import React from 'react';
import classnames from 'classnames';

interface Props {
  className?: string;
  name: string;
}

const EntityName: React.FunctionComponent<Props> = props => {
  const { className, name } = props;
  return <div className={classnames('name', className)}>{name}</div>;
};

export default EntityName;
