import React from 'react';
import classnames from 'classnames';

interface Props {
  className?: string;
  description?: string | null;
}

const Description: React.FunctionComponent<Props> = props => {
  const { className, description } = props;
  return (
    <div className={classnames('description', className)}>{description}</div>
  );
};

export default Description;
