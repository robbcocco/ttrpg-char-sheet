import { CharacterInfo } from "./character-info";

export type CharacterAbilityScore = {
    name: AbilityName;
    key: AbilityKey;
    value: number;
    savingThrowProficient: boolean;
}

export const initCharacterAbilityScore = (score?: CharacterAbilityScore | [AbilityName, AbilityKey], proficiencies: AbilityKey[] = []): CharacterAbilityScore => {
    if (score && !('name' in score)) {
        return {
            name: score[0],
            key: score[1],
            value: 10,
            savingThrowProficient: proficiencies.includes(score[1])
        }
    } else {
        const key = score?.key ?? 'str';
        const isProficient = proficiencies.includes(key);
        return {
            name: score?.name ?? 'strength',
            key: key,
            value: score?.value ?? 10,
            savingThrowProficient: isProficient,
        }
    }
}

export const CharacterAbilityModifier = (score?: CharacterAbilityScore) => score ? Math.floor((score.value - 10) / 2) : 0;

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
