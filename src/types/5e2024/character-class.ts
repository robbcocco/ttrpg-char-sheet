import { normalizeEntriesToText } from '@/utils/json';
import index from '../../data/class/index.json';
import { AbilityKey } from './character-ability-score';
import { CharacterSubclass, CharacterSubclassFeature } from './character-subclass';
import { CharacterFeat } from './character-feat';
import { loadSkills } from './character-skill';

export type CharacterClass = {
    name: string;
    source: string;
    level: number;
    healthDice: number;
    proficiency: AbilityKey[];
    startingProficiencies: CharacterProficiency;
    multiclassProficiencies: CharacterProficiency;
    feats: CharacterClassFeature[];
    spellcastingAbility?: AbilityKey;
    subclass?: CharacterSubclass;
}

export const initCharacterClass = (characterClass: ICharacterClass | CharacterClass): CharacterClass => {
    if (characterClass && 'page' in characterClass) {
        return {
            name: characterClass.name,
            source: characterClass.source,
            level: 1,
            healthDice: characterClass.hd.faces,
            proficiency: characterClass.proficiency,
            startingProficiencies: initCharacterProficiency(characterClass.name, characterClass.startingProficiencies),
            multiclassProficiencies: initCharacterProficiency(characterClass.name, characterClass.multiclassing.proficienciesGained),
            feats: initCharacterClassFeature(characterClass.classFeatures),
            spellcastingAbility: characterClass.spellcastingAbility as AbilityKey,
        }
    } else {
        return {
            name: characterClass.name ?? '',
            source: characterClass.source ?? '',
            level: characterClass.level ?? 1,
            healthDice: characterClass.healthDice ?? 6,
            proficiency: characterClass.proficiency ?? [],
            startingProficiencies: characterClass.startingProficiencies,
            multiclassProficiencies: characterClass.multiclassProficiencies,
            feats: characterClass.feats,
            spellcastingAbility: characterClass.spellcastingAbility,
            subclass: characterClass.subclass
        }
    }
}

export type CharacterProficiency = {
    weapons: string[];
    armor: string[];
    skills: CharacterSkillProficiency[]
}

export type CharacterSkillProficiency = string | {
    from: string[];
    count: number;
    className: string;
    used: string[];
}

export type CharacterClassFeature = CharacterFeat & {
    level: number,
    className: string,
}

export const sortCharacterSkillProficiencies = (proficiencies: CharacterSkillProficiency[]): CharacterSkillProficiency[] => {
    return proficiencies.sort((a, b) => {
        const isAString = typeof a === "string";
        const isBString = typeof b === "string";

        if (isAString && !isBString) return -1;
        if (!isAString && isBString) return 1;

        if (isAString && isBString) {
            return (a as string).localeCompare(b as string);
        }

        const objA = a as { from: string[]; count: number };
        const objB = b as { from: string[]; count: number };

        return objA.from.length - objB.from.length;
    })
}

export const initCharacterProficiency = (className: string, proficiencies?: ICharacterProficiencies | CharacterProficiency): CharacterProficiency => {
    const skills: CharacterSkillProficiency[] = [];

    for (const skill of proficiencies?.skills ?? []) {
        if (typeof (skill) == 'string') {
            skills.push(skill);
        } else if ('from' in skill) {
            skills.push({ ...skill, className: className, used: [] });
        } else if ('any' in skill) {
            skills.push({
                from: loadSkills().map(s => s.name),
                count: skill.any,
                className: className,
                used: []
            })
        } else if ('choose' in skill) {
            skills.push({ ...skill.choose, className: className, used: [] });
        }
    }

    return {
        weapons: proficiencies?.weapons || [],
        armor: proficiencies?.armor || [],
        skills: sortCharacterSkillProficiencies(skills)
    }
}

export const initCharacterClassFeature = (feats?: (string | CharacterClassFeature | {
    classFeature: string,
    gainSubclassFeature: boolean
})[]): CharacterClassFeature[] => {
    const newFeats: CharacterClassFeature[] = [];

    for (const feat of feats ?? []) {
        if (typeof (feat) == 'string' || !('gainSubclassFeature' in feat)) {
            const newFeat = parseClassFeature(feat, []);
            newFeats.push(newFeat);
        }
    }

    return newFeats;
}

export const CharacterClassUnlockedFeats = (characterClass: CharacterClass): (CharacterClassFeature | CharacterSubclassFeature)[] => {
    let feats: (CharacterClassFeature | CharacterSubclassFeature)[] = [];
    feats = feats.concat(characterClass.feats);
    if (characterClass.subclass) feats = feats.concat(characterClass.subclass.feats);

    return feats.filter((feat) => feat && feat.level && characterClass.level >= feat.level).sort((a, b) => a.level - b.level);
}

export const parseClassFeature = (feature: string | CharacterClassFeature, classFeatures: ICharacterClassFeature[]): CharacterClassFeature => {
    //"Reckless Attack|Barbarian|XPHB|2",
    if (typeof (feature) == 'string') {
        const [name, className, source, level] = feature.split('|');
        const classFeature = classFeatures.find(cf => cf.name == name && cf.className == className && cf.source == source);
        return {
            name: name.trim(),
            source: source.trim(),
            className: className.trim(),
            level: Number(level.trim()),
            description: classFeature ? normalizeEntriesToText(classFeature.entries) : ''
        }
    } else {
        const classFeature = classFeatures.find(cf => cf.name == feature.name && cf.className == feature.className && cf.source == feature.source);
        return { ...feature, description: classFeature ? normalizeEntriesToText(classFeature.entries) : '' };
    }
}

export const loadClasses = async (): Promise<ICharacterClass[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const classes: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [key, value] of Object.entries(index)) {
        const temp = await import(`../../data/class/${value}`);
        classes.push(temp.class.filter((c: { source: string; }) => c.source == 'XPHB'));
    }

    return classes.flat();
}

export const loadClassFeatures = async (classNames: string[]): Promise<ICharacterClassFeature[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const features: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [key, value] of Object.entries(index)) {
        const temp = await import(`../../data/class/${value}`);
        features.push(temp.classFeature.filter((c: { className: string, source: string; }) => (classNames.includes(c.className) && c.source == 'XPHB')));
    }

    return features.flat().sort((a, b) => a.name.localeCompare(b.name));
}

export interface ICharacterClass {
    name: string;
    source: string;
    page: number;
    srd: boolean;
    basicRules: boolean;
    reprintedAs: string[];
    edition: string;
    hd: {
        number: number;
        faces: number;
    };
    proficiency: AbilityKey[];
    spellcastingAbility: string;
    casterProgression: string;
    preparedSpells: string;
    cantripProgression: number[];
    spellsKnownProgressionFixed: number[];
    spellsKnownProgressionFixedAllowLowerLevel: boolean;
    startingProficiencies: ICharacterProficiencies;
    startingEquipment: {
        additionalFromBackground: boolean;
        default: string[];
        goldAlternative: string;
        defaultData: unknown[];
        entries?: undefined;
    };
    multiclassing: {
        proficienciesGained: ICharacterProficiencies
    };
    featProgression?: undefined;
    classFeatures?: (string | {
        classFeature: string,
        gainSubclassFeature: boolean
    })[]
}

export interface ICharacterProficiencies {
    weapons: string[];
    armor: string[];
    skills: (string | { any: number; } | {
        choose: {
            from: string[];
            count: number;
        };
    })[];
}

export interface ICharacterClassFeature {
    name: string;
    source: string;
    page: number;
    srd: boolean;
    basicRules: boolean;
    className: string;
    classSource: string;
    level: number;
    entries: (string | {
        type: string;
        name: string;
        entries: (string | {
            type: string;
            name: string;
            attributes: string[];
        })[];
    })
}
