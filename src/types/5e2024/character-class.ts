import index from '../../data/class/index.json';
import { AbilityKey } from './character-ability-score';

export class CharacterClass {
    constructor(characterClass: ICharacterClass) {
        this.name = characterClass.name;
        this.source = characterClass.source;
        this.level = 1;
        this.spellcastingAbility = characterClass.spellcastingAbility as AbilityKey;
    }

    name: string;
    source: string;
    level: number;
    spellcastingAbility: AbilityKey;

    subclass: CharacterSubclass;

    static loadClasses = async (): Promise<ICharacterClass[]> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const classes: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [key, value] of Object.entries(index)) {
            const temp = await import(`../../data/class/${value}`);
            classes.push(temp.class.filter((c: { source: string; }) => c.source == 'XPHB'));
        }

        return classes.flat();
    }

    loadSublasses = async (): Promise<ICharacterSubclass[]> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subclasses: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [key, value] of Object.entries(index)) {
            const temp = await import(`../../data/class/${value}`);
            // Check if subclass exists and is an array before filtering
            if (temp.subclass && Array.isArray(temp.subclass)) {
                subclasses.push(temp.subclass.filter((c: { className: string, source: string; }) => (c.className == this.name)));
            }
        }

        return subclasses.flat().sort((a, b) => a.name.localeCompare(b.name));
    }

    loadClassFeatures = async (): Promise<ICharacterClassFeature[]> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const features: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [key, value] of Object.entries(index)) {
            const temp = await import(`../../data/class/${value}`);
            features.push(temp.classFeature.filter((c: { className: string, source: string; }) => (c.className == this.name && c.source == 'XPHB')));
        }

        return features.flat().sort((a, b) => a.name.localeCompare(b.name));
    }

    loadSublassFeatures = async (): Promise<ICharacterSubclassFeature[]> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const features: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [key, value] of Object.entries(index)) {
            const temp = await import(`../../data/class/${value}`);
            features.push(temp.subclassFeature.filter((c: { subclassShortName: string, source: string; }) => (c.subclassShortName == this.subclass.shortname)));
        }

        return features.flat().sort((a, b) => a.name.localeCompare(b.name));
    }
}

export class CharacterSubclass {
    constructor(characterSubclass: ICharacterSubclass) {
        this.name = characterSubclass.name;
        this.source = characterSubclass.source;
        this.classSource = characterSubclass.source;
        this.shortname = characterSubclass.shortName;
    }

    name: string;
    shortname: string;
    source: string;
    classSource: string;
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

export interface ICharacterSubclass {
    name: string;
    shortName: string;
    source: string;
    className: string;
    classSource: string;
    page: number;
    reprintedAs: string[];
    edition: string;
    subclassFeatures: string[];
    srd?: undefined;
    basicRules?: undefined;
    additionalSpells?: undefined;
    hasFluff?: undefined;
    hasFluffImages?: undefined;
    fluff?: undefined;
    otherSources?: undefined;
    srd52?: undefined;
    basicRules2024?: undefined;
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

export interface ICharacterSubclassFeature {
    name: string;
    source: string;
    page: number;
    className: string;
    classSource: string;
    subclassShortName: string;
    subclassSource: string;
    level: number;
    entries: (string | {
        type: string;
        subclassFeature: string;
    })[];
    header?: undefined;
    srd?: undefined;
    basicRules?: undefined;
    otherSources?: undefined;
    type?: undefined;
    srd52?: undefined;
    basicRules2024?: undefined;
}
