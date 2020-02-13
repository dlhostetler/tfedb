import React from 'react';
import classnames from 'classnames';
import * as entity from '../../../../../types/entity';
import EntityLink from '../../../../links/EntityLink';

interface Props {
  className?: string;
  spawn: entity.Spawn;
}

function withArticle(prefix: string | null, name: string) {
  const s = prefix || name;
  if (prefix) {
    prefix = ` ${prefix}`;
  } else {
    prefix = '';
  }
  const firstChar = s.substr(0, 1);
  if (['a', 'e', 'i', 'o', 'u'].includes(firstChar)) {
    return `An${prefix}`;
  }
  return `A${prefix}`;
}

function mobInfo(spawn: entity.Spawn) {
  if (!spawn.mob) {
    return null;
  }
  let name = spawn.mob.name;
  let prefix = spawn.mob.herePrefix;
  if (!name) {
    name = spawn.mob.appearance;
    prefix = withArticle(spawn.mob.herePrefix, name);
  }
  return {
    id: spawn.mob.id,
    name: name,
    prefix: prefix,
    suffix: spawn.mob.hereSuffix,
    type: 'mob',
  };
}

function objectInfo(spawn: entity.Spawn) {
  if (!spawn.object) {
    return null;
  }
  return {
    id: spawn.object.id,
    name: spawn.object.name,
    prefix: withArticle(spawn.object.herePrefix, spawn.object.name),
    suffix: spawn.object.hereSuffix,
    type: 'object',
  };
}

function Spawn(props: Props) {
  const { className, spawn } = props;
  const spawnInfo = mobInfo(spawn) || objectInfo(spawn);
  if (!spawnInfo) {
    return null;
  }
  return (
    <div className={classnames('spawn', className)}>
      {spawnInfo.prefix && <span className="prefix">{spawnInfo.prefix}</span>}
      <EntityLink className="name" id={spawnInfo.id} type={spawnInfo.type}>
        {spawnInfo.name}
      </EntityLink>
      <span className="suffix">{spawnInfo.suffix}</span>
    </div>
  );
}

export default Spawn;
