import React from 'react';
import classnames from 'classnames';

interface Props {
  className?: string;
  visible?: boolean;
  title: string;
}

const defaultProps = {
  visible: true,
};

const Section: React.FunctionComponent<Props> = props => {
  const { children, className, title, visible } = Object.assign(
    {},
    defaultProps,
    props
  );
  if (!visible) {
    return null;
  }
  return (
    <div className={classnames('section', className)}>
      <div className="title">{title}</div>
      {children}
    </div>
  );
};

export default Section;
