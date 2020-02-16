import React from 'react';
import * as entity from '../../../../../types/entity';
import { EntityHere } from '../../../../entity';

interface Props {
  className?: string;
  spawn: entity.Spawn;
}

function mobHereProps(spawn: entity.Spawn) {
  if (!spawn.mob) {
    return null;
  }
  return {
    id: spawn.mob.id,
    includePrefix: !Boolean(spawn.mob.name),
    link: true,
    name: spawn.mob.name || spawn.mob.appearance,
    plural: false,
    prefix: spawn.mob.herePrefix,
    suffix: spawn.mob.hereSuffix,
    type: 'mob',
  };
}

function objectHereProps(spawn: entity.Spawn) {
  if (!spawn.object) {
    return null;
  }
  return {
    id: spawn.object.id,
    includePrefix: true,
    link: true,
    name: spawn.object.name,
    plural: false,
    prefix: spawn.object.herePrefix,
    suffix: spawn.object.hereSuffix,
    type: 'object',
  };
}

function Spawn(props: Props) {
  const { className, spawn } = props;
  const hereProps = mobHereProps(spawn) || objectHereProps(spawn);
  if (!hereProps) {
    return null;
  }
  return <EntityHere className={className} {...hereProps} />;
}

export default Spawn;
