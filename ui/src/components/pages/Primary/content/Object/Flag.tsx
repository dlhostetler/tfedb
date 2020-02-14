import React from 'react';
import classnames from 'classnames';

interface Props {
  className?: string;
  flag: string;
}

function Flag(props: Props) {
  const { className, flag } = props;
  return <div className={classnames('flag', className)}>{flag}</div>;
}

export default Flag;
