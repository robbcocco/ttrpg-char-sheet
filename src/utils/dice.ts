import { DiceRoll } from '@/types/character';

export function rollDice(diceRoll: DiceRoll): number {
  let total = 0;
  for (let i = 0; i < diceRoll.count; i++) {
    total += Math.floor(Math.random() * diceRoll.sides) + 1;
  }
  return total + diceRoll.modifier;
}

export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function getProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

export function formatModifier(modifier: number): string {
    return modifier >= 0 ? `${modifier}` : `-${modifier}`;
}

export function parseDiceString(diceString: string): DiceRoll | null {
  const match = diceString.match(/^(\d+)?d(\d+)([+-]\d+)?$/);
  if (!match) return null;
  
  const count = parseInt(match[1] || '1');
  const sides = parseInt(match[2]);
  const modifier = parseInt(match[3] || '0');
  
  return { count, sides, modifier };
}

export function formatDiceRoll(diceRoll: DiceRoll): string {
  const countStr = diceRoll.count === 1 ? '' : diceRoll.count.toString();
  const modifierStr = diceRoll.modifier === 0 ? '' : formatModifier(diceRoll.modifier);
  return `${countStr}d${diceRoll.sides}${modifierStr}`;
}
