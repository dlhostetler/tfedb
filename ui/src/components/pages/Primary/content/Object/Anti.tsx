import React from 'react';
import classnames from 'classnames';
import { arrayToString } from '../../../../../format/array';

interface Props {
  className?: string;
  anti: string[];
}

function Anti(props: Props) {
  const { anti, className } = props;
  if (!anti) {
    return null;
  }
  return (
    <div className={classnames('anti', className)}>{arrayToString(anti)}</div>
  );
}

export default Anti;
