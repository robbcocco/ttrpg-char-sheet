import { normalizeEntriesToText } from "@/utils/json";
import { skill as skills } from '../../data/skills.json';
import { AbilityKey, CharacterAbilityModifier, CharacterAbilityScore } from "./character-ability-score";
import { CharacterInfo } from "./character-info";

export type CharacterSkill = {
    name: string;
    source: string;
    description: string;
    ability: AbilityKey;
    proficient: boolean;
}

export const initCharacterSkill = (skill?: ICharacterSkill | CharacterSkill): CharacterSkill => {
    if (skill && 'page' in skill) {
        return {
            name: skill.name,
            source: skill.source,
            ability: skill.ability as AbilityKey,
            description: normalizeEntriesToText<ICharacterSkill['entries']>(skill.entries),
            proficient: false,
        }
    } else {
        return {
            name: skill?.name ?? '',
            source: skill?.source ?? '',
            description: skill?.description ?? '',
            ability: skill?.ability ?? 'str',
            proficient: skill?.proficient ?? false
        }
    }
}

export const CharacterSkillScore = ({
    skill,
    abilityScores,
    info
}: { skill: CharacterSkill, abilityScores: CharacterAbilityScore[], info: CharacterInfo }) => {
    const score = abilityScores.find(score => score.key == skill.ability);
    if (!score) {
        return 0;
    }
    return skill.proficient ? CharacterAbilityModifier(score) + Number(info.proficiencyBonus) : CharacterAbilityModifier(score);
}


export const loadSkills = (): (ICharacterSkill)[] => {
    return skills.filter(skill => skill.source == 'XPHB');
}

export interface ICharacterSkill {
    name: string;
    source: string;
    page: number;
    ability: string;
    entries: (string | {
        type: string;
        items: string[];
    })[];
    basicRules?: boolean;
}
