import React from 'react';
import classnames from 'classnames';

interface Props {
  className?: string;
  title: string;
}

export const TitledBorder: React.FunctionComponent<Props> = props => {
  const { children, className, title } = props;
  return (
    <fieldset className={classnames('titled-border', className)}>
      <legend>{title}</legend>
      {children}
    </fieldset>
  );
};

export default TitledBorder;
