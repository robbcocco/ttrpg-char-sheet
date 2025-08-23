import { normalizeEntriesToText } from "@/utils/json";
import { feat as feats } from '../../data/feats.json';
import { CharacterSkillProficiency, loadSkills } from "./character-skill";

export type CharacterFeat = {
    name: string,
    source: string,
    proficiencies: CharacterSkillProficiency[]
    description: string
}

export const initCharacterFeat = (feat: ICharacterFeat | CharacterFeat): CharacterFeat => {
    if (feat && 'page' in feat) {
        return {
            name: feat.name,
            source: feat.source,
            proficiencies: feat.skillProficiencies ? initCharacterFeatSkillProficiencies(feat.name, feat.skillProficiencies) : [],
            description: feat.entries ? normalizeEntriesToText<ICharacterFeat['entries']>(feat.entries) : '',
        }
    } else {
        return {
            name: feat?.name ?? '',
            source: feat?.source ?? '',
            proficiencies: feat.proficiencies ?? [],
            description: feat?.description ?? '',
        }
    }
}

export const initCharacterFeatSkillProficiencies = (featName: string, skillProficiencies: (string | ICharacterFeatSkillProficiency)[]): CharacterSkillProficiency[] => {
    const skills: CharacterSkillProficiency[] = [];
    const skillList = loadSkills().map(s => s.name);

    for (const skill of skillProficiencies ?? []) {
        if (typeof (skill) == 'string') {
            skills.push(skill);
        } else {
            // if ('from' in skill) {
            //     skills.push({ ...skill, origin: backgroundName, used: [] });
            if ('any' in skill) {
                skills.push({
                    from: skillList,
                    count: skill.any ?? 1,
                    origin: featName,
                    used: [],
                })
            }
            for (const key in skill) {
                if (Object.prototype.hasOwnProperty.call(skill, key)) {
                    const element = skill[key];
                    if (key == 'choose' &&
                        element && typeof (element) != 'number'
                        && typeof (element) != 'boolean'
                        && 'from' in element
                    ) {
                        skills.push({ from: element.from, count: element.count ?? 1, origin: featName, used: [] });
                    } else if (element && typeof (element) == 'boolean' && skillList.map(s => s.toLowerCase()).includes(key.toLowerCase())) {
                        skills.push(key);
                    }
                }
            }
        }
    }
    return skills;
}

export const loadFeats = (): ICharacterFeat[] => {
    return feats;
}

export interface ICharacterFeatSkillProficiency {
    any?: number,
    choose?: {
        from: string[],
        count?: number
    },
    [key: string]: boolean | {
        from: string[],
        count?: number
    } | number | undefined,
}

export interface ICharacterFeat {
    name: string;
    source: string;
    page: number;
    prerequisite?: unknown[];
    ability?: unknown[];
    additionalSpells?: unknown[];
    skillProficiencies?: (string | ICharacterFeatSkillProficiency)[]
    entries: (string | {
        type: string;
        items: string[];
        caption?: undefined;
        colLabels?: undefined;
        colStyles?: undefined;
        rows?: undefined;
        entries?: undefined;
    } | {
        type: string;
        caption: string;
        colLabels: string[];
        colStyles: string[];
        rows: string[][];
        items?: undefined;
        entries?: undefined;
    } | {
        type: string;
        entries: {
            type: string;
            entries: {
                type: string;
                name: string;
                entries: string[];
            }[];
        }[];
        items?: undefined;
        caption?: undefined;
        colLabels?: undefined;
        colStyles?: undefined;
        rows?: undefined;
    } | unknown)[];
}
