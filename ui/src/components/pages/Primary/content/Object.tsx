import React from 'react';
import * as entity from '../../../../types/entity';
import { get } from 'lodash';
import { useParams } from 'react-router-dom';
import { useGraphql } from '../../../../hooks';
import List from '../../../common/List';
import {
  Entity,
  EntityName,
  EntitySection,
  EntitySubheader,
} from '../../../entity';
import EntityLink from '../../../links/EntityLink';

interface ObjectResult {
  object: entity.Object;
}

interface Params {
  objectId: string;
}

const query = `query Object($objectId: String) {
  object(id: $objectId) {
    affects {
      amount
      type
    }
    mobs {
      appearance
      id
      name
    }
    name
    subtype
  }
}`;

const ObjectPage: React.FunctionComponent = () => {
  const { objectId } = useParams<Params>();
  const { error, isLoading, result } = useGraphql<ObjectResult>(query, {
    objectId,
  });
  const object = get(result, 'object');
  return (
    <Entity className="object" error={error} isLoading={isLoading}>
      <EntityName name={get(object, 'name', 'n/a')} />
      <EntitySubheader text={get(object, 'subtype')} />
      <EntitySection title="Mobs">
        <List<entity.Mob> items={get(object, 'mobs', [])}>
          {mob => (
            <EntityLink id={mob.id} type="mob">
              {mob.name || mob.appearance}
            </EntityLink>
          )}
        </List>
      </EntitySection>
    </Entity>
  );
};

export default ObjectPage;
