import React from 'react';
import * as entity from '../../../../../types/entity';
import { get, isEmpty } from 'lodash';
import { useParams } from 'react-router-dom';
import { useGraphql } from '../../../../../hooks';
import {
  Entity,
  EntityDescription,
  EntityName,
  EntitySection,
  EntitySubheader,
  Script,
} from '../../../../entity';
import Row from '../../../../layout/Row';
import Combat from './Combat';
import Demographics from './Demographics';
import Rooms from '../../../../entity/Rooms';
import Objects from '../../../../entity/Objects';
import Metadata from './Metadata';
import List from '../../../../layout/List';
import { Title } from '../../../../common/Title';

interface MobResult {
  mob: entity.Mob;
}

interface Params {
  mobId: string;
}

const query = `query Mob($mobId: String) {
  mob(id: $mobId) {
    adult
    affects
    alignment {
      id
      name
    }
    appearance
    appearancePlural
    armor {
      armor
      chance
      name
    }
    attacks {
      code
      descriptions {
        placeholder
        value
      }
    }
    attributes {
      type
      value
    }
    corpse {
      id
      name
    }
    creator
    description
    dice {
      dice {
        number
        plus
        sides
      }
      purpose
    }
    gold
    group {
      id
      name
    }
    herePrefix
    hereSuffix
    herePluralPrefix
    herePluralSuffix
    id
    keywords
    level
    maturity
    name
    nation {
      id
      name
    }
    objects {
      object {
        id
        name
      }
    }
    race {
      id
      name
    }
    resists {
      type
      value
    }
    rooms {
      id
      name
    }
    scripts {
      code
      descriptions {
        placeholder
        value
      }
      type
    }
    sex
    size
    skeleton {
      id
      name
    }
    weight
    zombie {
      id
      name
    }
  }
}`;

const MobPage: React.FunctionComponent = () => {
  const { mobId } = useParams<Params>();
  const { error, isLoading, result } = useGraphql<MobResult>(query, {
    mobId,
  });
  const mob = get(result, 'mob');
  if (!mob) {
    return null;
  }
  return (
    <Entity className="mob" error={error} isLoading={isLoading}>
      <Title text={[mobId, mob.appearance || mob.name, 'mob']} />
      <EntityName name={mob.name || mob.appearance} />
      <EntitySubheader text={get(mob, 'race.name')} />
      <EntityDescription description={get(mob, 'description')} />
      <Row>
        <Combat mob={mob} />
        <Demographics mob={mob} />
      </Row>
      <Row>
        <EntitySection title="Loot" visible={!isEmpty(mob.objects)}>
          <Objects objects={mob.objects.map(o => o.object)} />
        </EntitySection>
        <EntitySection title="Rooms" visible={!isEmpty(mob.rooms)}>
          <Rooms rooms={mob.rooms} />
        </EntitySection>
      </Row>
      <EntitySection title="Attacks">
        <Script script={mob.attacks} />
      </EntitySection>
      <EntitySection title="Scripts" visible={!isEmpty(mob.scripts)}>
        <List<entity.Script> className="scripts" items={mob.scripts}>
          {script => {
            return <Script script={script} />;
          }}
        </List>
      </EntitySection>
      <Metadata mob={mob} />
    </Entity>
  );
};

export default MobPage;
