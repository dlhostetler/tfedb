import * as entity from '../types/entity';

export function prettyDice(dice: entity.Dice) {
  if (!dice) {
    return null;
  }
  let s = `${dice.number}d${dice.sides}`;
  if (dice.plus) {
    s = `${s}+${dice.plus}`;
  }
  return s;
}
