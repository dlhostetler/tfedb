import React from 'react';
import classnames from 'classnames';
import { isNull } from 'lodash';

interface Props {
  className?: string;
  name: string;
  value?: string | number | null;
}

export const NamedValue: React.FunctionComponent<Props> = props => {
  const { children, className, name, value } = props;
  if (isNull(value)) {
    return null;
  }
  return (
    <tr className={classnames('named-value', className)}>
      <td className="name">{name}</td>
      <td className="value">{children || value}</td>
    </tr>
  );
};

export default NamedValue;
