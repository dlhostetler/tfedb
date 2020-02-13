import React from 'react';
import classnames from 'classnames';

interface Props {
  className?: string;
  title: string;
}

const Section: React.FunctionComponent<Props> = props => {
  const { children, className, title } = props;
  return (
    <div className={classnames('section', className)}>
      <div className="title">{title}</div>
      {children}
    </div>
  );
};

export default Section;
