import React from 'react';
import classnames from 'classnames';
import * as entity from '../../../../../types/entity';

interface Props {
  className?: string;
  poi: entity.Poi;
}

function prettify(s: string) {
  return s.split(/\s+/).join(" ");
}

function Poi(props: Props) {
  const { className, poi } = props;
  return (
    <div className={classnames('poi', className)}>
      <div className="keywords">{poi.keywords}</div>
      <div className="description">{prettify(poi.description)}</div>
    </div>
  );
}

export default Poi;
