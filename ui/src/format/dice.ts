import * as entity from '../types/entity';

export function prettyDice(dice: entity.Dice) {
  if (!dice) {
    return null;
  }
  if (dice.number === 0 || !dice.sides) {
    return '0';
  }
  let s = `${dice.number}d${dice.sides}`;
  let from = dice.number;
  let to = dice.number * dice.sides;
  if (dice.plus) {
    s = `${s}+${dice.plus}`;
    from += dice.plus;
    to += dice.plus;
  }
  s = `${s} (${from}-${to})`;
  return s;
}
