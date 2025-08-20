import { CharacterInfo } from "./character-info";

export type CharacterAbilityScore = {
    name: AbilityName;
    key: AbilityKey;
    value: number;
    savingThrowProficient: boolean;
}

export const initCharacterAbilityScore = (score?: CharacterAbilityScore | [AbilityName, AbilityKey]): CharacterAbilityScore => {
    if (score && !('name' in score)) {
        return {
            name: score[0],
            key: score[1],
            value: 10,
            savingThrowProficient: false
        }
    } else {
        return {
            name: score?.name ?? 'strength',
            key: score?.key ?? 'str',
            value: score?.value ?? 10,
            savingThrowProficient: score?.savingThrowProficient ?? false,
        }
    }
}

export const CharacterAbilityModifier = (score: CharacterAbilityScore) => Math.floor((score.value - 10) / 2);

export const CharacterAbilitySavingThrow = ({
    score,
    info
}: { score: CharacterAbilityScore, info: CharacterInfo }) =>
    score.savingThrowProficient ? CharacterAbilityModifier(score) + Number(info.proficiencyBonus) : CharacterAbilityModifier(score);

export type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export type AbilityName =
    | 'strength'
    | 'dexterity'
    | 'constitution'
    | 'intelligence'
    | 'wisdom'
    | 'charisma';