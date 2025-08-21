import index from '../../data/class/index.json';
import { AbilityKey } from './character-ability-score';
import { CharacterSubclass } from './character-subclass';

export type CharacterClass = {
    name: string;
    source: string;
    level: number;
    healthDice: number;
    proficiency: AbilityKey[];
    startingProficiencies: CharacterProficiency;
    multiclassProficiencies: CharacterProficiency;
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
            startingProficiencies: initCharacterProficiency(characterClass.startingProficiencies),
            multiclassProficiencies: initCharacterProficiency(characterClass.multiclassing.proficienciesGained),
            spellcastingAbility: characterClass.spellcastingAbility as AbilityKey
        }
    } else {
        return {
            name: characterClass?.name ?? '',
            source: characterClass?.source ?? '',
            level: characterClass?.level ?? 1,
            healthDice: characterClass?.healthDice ?? 6,
            proficiency: characterClass?.proficiency ?? [],
            startingProficiencies: characterClass?.startingProficiencies,
            multiclassProficiencies: characterClass?.multiclassProficiencies,
            spellcastingAbility: characterClass.spellcastingAbility
        }
    }
}

export type CharacterProficiency = {
    weapons: string[];
    armor: string[];
    skills: (string | {
        choose: {
            from: string[];
            count: number;
        };
    })[];
}

export const initCharacterProficiency = (proficiencies?: ICharacterProficiencies | CharacterProficiency): CharacterProficiency => {
    return {
        weapons: proficiencies?.weapons || [],
        armor: proficiencies?.armor || [],
        skills: proficiencies?.skills || []
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

export const loadClassFeatures = async (className: string): Promise<ICharacterClassFeature[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const features: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [key, value] of Object.entries(index)) {
        const temp = await import(`../../data/class/${value}`);
        features.push(temp.classFeature.filter((c: { className: string, source: string; }) => (c.className == className && c.source == 'XPHB')));
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
}

export interface ICharacterProficiencies {
    weapons: string[];
    armor: string[];
    skills: (string | {
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
