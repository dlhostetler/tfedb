import React from 'react';
import { isEmpty } from 'lodash';
import * as entity from '../../types/entity';
import List from '../layout/List';
import EntityLink from '../links/EntityLink';

interface Props {
  className?: string;
  recipes: entity.Recipe[];
}

function Recipes(props: Props) {
  const { recipes } = props;
  if (isEmpty(recipes)) {
    return null;
  }
  return (
    <List<entity.Recipe> className="recipes" items={recipes}>
      {recipe => (
        <div>
          Made by
          <EntityLink className="mob" id={recipe.mob.id} type="mob">
            {recipe.mob.name || recipe.mob.appearance}
          </EntityLink>
          in
          <EntityLink className="room" id={recipe.room.id} type="room">
            {recipe.room.name}
          </EntityLink>
        </div>
      )}
    </List>
  );
}

export default Recipes;
