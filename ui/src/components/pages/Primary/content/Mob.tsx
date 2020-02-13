import React from 'react';
import * as entity from '../../../../types/entity';
import { get } from 'lodash';
import { useParams } from 'react-router-dom';
import { useGraphql } from '../../../../hooks';
import List from '../../../common/List';
import {
  Entity,
  EntityDescription,
  EntityName,
  EntitySection,
  EntitySubheader,
} from '../../../entity';
import EntityLink from '../../../links/EntityLink';

interface MobResult {
  mob: entity.Mob;
}

interface Params {
  mobId: string;
}

const query = `query Mob($mobId: String) {
  mob(id: $mobId) {
    appearance
    description
    name
    race {
      name
    }
    rooms {
      id
      name
    }
    spawns {
      mob {
        appearance
        id
        name
      }
      object {
        id
        name
      }
    }
  }
}`;

const MobPage: React.FunctionComponent = () => {
  const { mobId } = useParams<Params>();
  const { error, isLoading, result } = useGraphql<MobResult>(query, {
    mobId,
  });
  const mob = get(result, 'mob');
  return (
    <Entity className="mob" error={error} isLoading={isLoading}>
      <EntityName name={get(mob, 'name', 'n/a')} />
      <EntitySubheader text={get(mob, 'race.name')} />
      <EntityDescription description={get(mob, 'description')} />
      <EntitySection title="Mobs">
        <List<entity.Room> items={get(mob, 'rooms', [])}>
          {room => (
            <EntityLink id={room.id} type="room">
              {room.name}
            </EntityLink>
          )}
        </List>
      </EntitySection>
    </Entity>
  );
};

export default MobPage;
