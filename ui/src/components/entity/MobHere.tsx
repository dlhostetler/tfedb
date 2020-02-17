import React from 'react';
import classnames from 'classnames';
import * as entity from '../../types/entity';
import EntityLink from '../links/EntityLink';
import { prefixWithArticle } from '../../format/here';

interface Props {
  className?: string;
  link?: boolean;
  mob: entity.Mob;
}

function Prefix(props: Props) {
  const { mob } = props;
  if (mob.name) {
    return null;
  }
  return (
    <span className="prefix">
      {prefixWithArticle(mob.herePrefix, false, mob.appearance)}
    </span>
  );
}

function Name(props: Props) {
  const { link, mob } = props;
  const name = mob.name || mob.appearance;
  if (!link) {
    return <span className="name">{name}</span>;
  }
  return (
    <EntityLink className="name" id={mob.id} type="mob">
      {name}
    </EntityLink>
  );
}

function Suffix(props: Props) {
  const { mob } = props;
  return <span className="suffix">{mob.hereSuffix}</span>;
}

function MobHere(props: Props) {
  const { className } = props;
  return (
    <div className={classnames('here', 'mob', className)}>
      <Prefix {...props} />
      <Name {...props} />
      <Suffix {...props} />
    </div>
  );
}

export default MobHere;
