import React from 'react';
import { isEmpty, sortBy } from 'lodash';
import * as entity from '../../../../../types/entity';
import { EntitySection } from '../../../../entity';
import List from '../../../../layout/List';
import EntityLink from '../../../../links/EntityLink';

interface IngredientProps {
  ingredient: entity.Ingredient;
}

function Ingredient(props: IngredientProps) {
  const { ingredient } = props;
  return (
    <div className="ingredient">
      <span className="numRequired">{`${ingredient.numRequired}x`}</span>
      <EntityLink id={ingredient.object.id} type="object">
        {ingredient.object.name}
      </EntityLink>
    </div>
  );
}

interface RecipeProps {
  recipe: entity.Recipe;
}

function Recipe(props: RecipeProps) {
  const { recipe } = props;
  return (
    <div className="recipe">
      <EntityLink className="object" id={recipe.object.id} type="object">
        {recipe.object.name}
      </EntityLink>
      <List<entity.Ingredient>
        className="ingredients"
        items={recipe.ingredients}
      >
        {ingredient => <Ingredient ingredient={ingredient} />}
      </List>
    </div>
  );
}

interface Props {
  className?: string;
  room: entity.Room;
}

function Custom(props: Props) {
  const { className, room } = props;
  const recipes = sortBy(room.recipes, 'object.name');
  return (
    <EntitySection
      className={className}
      title="Custom"
      visible={!isEmpty(recipes)}
    >
      <List<entity.Recipe> className="recipes" items={recipes}>
        {recipe => <Recipe recipe={recipe} />}
      </List>
    </EntitySection>
  );
}

export default Custom;
