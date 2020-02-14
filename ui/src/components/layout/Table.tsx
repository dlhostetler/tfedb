import React from 'react';

interface Props {
  className?: string;
}

export const Table: React.FunctionComponent<Props> = props => {
  const { children, className } = props;
  return (
    <table className={className}>
      <tbody>{children}</tbody>
    </table>
  );
};

export default Table;
