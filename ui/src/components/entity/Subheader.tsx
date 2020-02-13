import React from 'react';
import classnames from 'classnames';

interface Props {
  className?: string;
  text?: string;
}

const Subheader: React.FunctionComponent<Props> = props => {
  const { className, text } = props;
  return <div className={classnames('subheader', className)}>{text}</div>;
};

export default Subheader;
