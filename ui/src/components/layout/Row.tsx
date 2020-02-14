import React from 'react';
import classnames from 'classnames';

interface Props {
  className?: string;
}

export const Row: React.FunctionComponent<Props> = props => {
  const { children, className } = props;
  return (
    <div className={classnames('layout', 'row', className)}>{children}</div>
  );
};

export default Row;
