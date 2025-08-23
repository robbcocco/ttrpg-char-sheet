import { normalizeEntriesToText } from "@/utils/json";
import { background as backgrounds } from '../../data/backgrounds.json';
import { CharacterSkillProficiency, loadSkills } from "./character-skill";

export type CharacterBackground = {
    name: string;
    source: string;
    description: string;
    ability: string;
    proficiencies: CharacterSkillProficiency[];
}

export const initCharacterBackground = (background?: ICharacterBackground | CharacterBackground): CharacterBackground => {
    if (background && 'page' in background) {
        return {
            name: background.name ?? '',
            source: background.source ?? '',
            description: background.entries ? normalizeEntriesToText<ICharacterBackground['entries']>(background.entries) : '',
            ability: '',
            proficiencies: initCharacterBackgroundSkillProficiencies(background.name, background.skillProficiencies)
        }
    } else {
        return {
            name: background?.name ?? '',
            source: background?.source ?? '',
            description: background?.description ?? '',
            ability: '',
            proficiencies: background?.proficiencies ?? []
        }
    }
}

export const initCharacterBackgroundSkillProficiencies = (backgroundName: string, skillProficiencies: (string | ICharacterBackgroundSkillProficiency)[]): CharacterSkillProficiency[] => {
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
                    origin: backgroundName,
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
                        skills.push({ from: element.from, count: element.count ?? 1, origin: backgroundName, used: [] });
                    } else if (element && typeof (element) == 'boolean' && skillList.map(s => s.toLowerCase()).includes(key.toLowerCase())) {
                        skills.push(key);
                    }
                }
            }
        }
    }
    return skills;
}

export const loadBackgrounds = (): Partial<ICharacterBackground>[] => {
    return backgrounds
        // .filter(background => background.source == 'XPHB')
        .sort((a, b) => a.name.localeCompare(b.name));
}

export interface ICharacterBackgroundSkillProficiency {
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

export interface ICharacterBackground {
    name: string;
    source: string;
    page: number;
    feats: unknown[];
    srd: boolean;
    basicRules: boolean;
    reprintedAs: string[];
    skillProficiencies: (string | ICharacterBackgroundSkillProficiency)[];
    languageProficiencies: unknown[];
    startingEquipment: unknown[];
    entries: unknown[];
    weaponProficiencies?: unknown;
}
