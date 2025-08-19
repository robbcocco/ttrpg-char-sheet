import { normalizeEntriesToText } from "@/utils/json";
import { skill as skills } from '../../data/skills.json';

export class CharacterSkill {
    constructor(
        skill: ICharacterSkillA | ICharacterSkillB
    ) {
        this.name = skill.name;
        this.ability = skill.ability;
        this.description = normalizeEntriesToText<ICharacterSkillA['entries'] | ICharacterSkillB['entries']>(skill.entries);
        this.proficient = false;
        this.score = () => 0;
    }

    name: string;
    description: string;
    ability: string;
    proficient: boolean;
    score: () => number;

    static loadSkills(): (ICharacterSkillA | ICharacterSkillB)[] {
        return skills.filter(skill => skill.source == 'XPHB');
    }
}

export interface ICharacterSkillA {
    name: string;
    source: string;
    page: number;
    srd52: boolean;
    ability: string;
    entries: string[];
    srd?: undefined;
    basicRules?: undefined;
    reprintedAs?: undefined;
}

export interface ICharacterSkillB {
    name: string;
    source: string;
    page: number;
    srd: boolean;
    basicRules: boolean;
    reprintedAs: string[];
    ability: string;
    entries: (string | {
        type: string;
        items: string[];
    })[];
    srd52?: undefined;
}
