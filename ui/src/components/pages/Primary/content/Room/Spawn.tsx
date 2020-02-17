import React from 'react';
import * as entity from '../../../../../types/entity';
import { MobHere, ObjectHere } from '../../../../entity';

interface Props {
  className?: string;
  spawn: entity.Spawn;
}

const Spawn: React.FunctionComponent<Props> = props => {
  const { children, className, spawn } = props;
  if (spawn.mob) {
    return (
      <>
        <MobHere className={className} link={true} mob={spawn.mob} />
        {children}
      </>
    );
  }
  if (spawn.object) {
    return (
      <>
        <ObjectHere
          className={className}
          link={true}
          liquid={spawn.liquid}
          object={spawn.object}
        />
        {children}
      </>
    );
  }
  return null;
};

export default Spawn;
