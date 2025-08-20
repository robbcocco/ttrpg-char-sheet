import index from '../../data/class/index.json';
import { AbilityKey } from './character-ability-score';
import { CharacterSubclass } from './character-subclass';

export type CharacterClass = {
    name: string;
    source: string;
    level: number;
    spellcastingAbility?: AbilityKey;
    subclass?: CharacterSubclass;
}

export const initCharacterClass = (characterClass: ICharacterClass | CharacterClass): CharacterClass => {
    if (characterClass && 'page' in characterClass) {
        return {
            name: characterClass.name,
            source: characterClass.source,
            level: 1,
            spellcastingAbility: characterClass.spellcastingAbility as AbilityKey
        }
    } else {
        return {
            name: characterClass?.name ?? '',
            source: characterClass?.source ?? '',
            level: characterClass?.level ?? 1,
            spellcastingAbility: characterClass.spellcastingAbility
        }
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
    proficiency: string[];
    spellcastingAbility: string;
    casterProgression: string;
    preparedSpells: string;
    cantripProgression: number[];
    spellsKnownProgressionFixed: number[];
    spellsKnownProgressionFixedAllowLowerLevel: boolean;
    startingProficiencies: {
        weapons: string[];
        skills: {
            choose: {
                from: string[];
                count: number;
            };
        }[];
    };
    startingEquipment: {
        additionalFromBackground: boolean;
        default: string[];
        goldAlternative: string;
        defaultData: unknown[];
        entries?: undefined;
    };
    //missing props
    featProgression?: undefined;
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
