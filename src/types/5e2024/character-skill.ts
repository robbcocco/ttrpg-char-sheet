import { normalizeEntriesToText } from "@/utils/json";
import { skill as skills } from '../../data/skills.json';
import { AbilityKey, CharacterAbilityModifier, CharacterAbilityScore } from "./character-ability-score";
import { CharacterInfo } from "./character-info";
import { CharacterSkillProficiency } from "./character-class";

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

interface CharacterSkillScoreProps {
    skill: CharacterSkill;
    abilityScores: CharacterAbilityScore[];
    info: CharacterInfo
}

export const CharacterSkillScore = ({
    skill,
    abilityScores,
    info
}: CharacterSkillScoreProps) => {
    const score = abilityScores.find(score => score.key == skill.ability);
    if (!score) {
        return 0;
    }
    return skill.proficient ? CharacterAbilityModifier(score) + Number(info.proficiencyBonus) : CharacterAbilityModifier(score);
}

export const CharacterSkillProficiencyAvailable = ({ skill, skillProficiencies}: {skill: CharacterSkill, skillProficiencies: CharacterSkillProficiency[]}): boolean => {
    for (const skillProficiency of skillProficiencies) {
        if (!skill.proficient && typeof(skillProficiency) != 'string' && skillProficiency.from.includes(skill.name.toLowerCase()) && skillProficiency.count > 0) return true;
    }

    return false;
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
