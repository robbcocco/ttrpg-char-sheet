import index from '../../data/class/index.json';

export type CharacterSubclass = {
    // constructor(characterSubclass: ICharacterSubclass) {
    //     this.name = characterSubclass.name;
    //     this.source = characterSubclass.source;
    //     this.classSource = characterSubclass.source;
    //     this.shortname = characterSubclass.shortName;
    // }

    name: string;
    shortName: string;
    source: string;
    classSource: string;
}

export const initCharacterSubclass = (subclass?: CharacterSubclass | ICharacterSubclass): CharacterSubclass => {
    if (subclass && 'page' in subclass) {
        return {
            name: subclass.name,
            source: subclass.source,
            classSource: subclass.classSource,
            shortName: subclass.shortName
        }
    } else {
        return {
            name: subclass?.name ?? '',
            source: subclass?.source ?? '',
            classSource: subclass?.classSource ?? '',
            shortName: subclass?.shortName ?? ''
        }
    }
}

export const loadSublasses = async (className: string): Promise<ICharacterSubclass[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subclasses: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [key, value] of Object.entries(index)) {
        const temp = await import(`../../data/class/${value}`);
        // Check if subclass exists and is an array before filtering
        if (temp.subclass && Array.isArray(temp.subclass)) {
            subclasses.push(temp.subclass.filter((c: { className: string, source: string; }) => (c.className == className)));
        }
    }

    return subclasses.flat().sort((a, b) => a.name.localeCompare(b.name));
}

export const loadSublassFeatures = async (subclassShortname: string): Promise<ICharacterSubclassFeature[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const features: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [key, value] of Object.entries(index)) {
        const temp = await import(`../../data/class/${value}`);
        features.push(temp.subclassFeature.filter((c: { subclassShortName: string, source: string; }) => (c.subclassShortName == subclassShortname)));
    }

    return features.flat().sort((a, b) => a.name.localeCompare(b.name));
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
