import { normalizeEntriesToText } from '@/utils/json';
import index from '../../data/class/index.json';
import { CharacterFeat } from './character-feat';

export type CharacterSubclass = {
    name: string;
    shortName: string;
    source: string;
    classSource: string;
    feats: CharacterSubclassFeature[]
}

export type CharacterSubclassFeature = CharacterFeat & {
    level: number,
    shortName: string,
    className: string,
    classSource: string,
}

export const initCharacterSubclass = (subclass: CharacterSubclass | ICharacterSubclass): CharacterSubclass => {
    if (subclass && 'page' in subclass) {
        return {
            name: subclass.name,
            source: subclass.source,
            classSource: subclass.classSource,
            shortName: subclass.shortName,
            feats: initCharacterSubclassFeature(subclass.subclassFeatures)
        }
    } else {
        return {
            name: subclass.name ?? '',
            source: subclass.source ?? '',
            classSource: subclass.classSource ?? '',
            shortName: subclass.shortName ?? '',
            feats: subclass.feats
        }
    }
}

export const initCharacterSubclassFeature = (feats?: (string | CharacterSubclassFeature)[]): CharacterSubclassFeature[] => {
    const newFeats: CharacterSubclassFeature[] = [];

    for (const feat of feats ?? []) {
        if (typeof (feat) == 'string' || !('gainSubclassFeature' in feat)) {
            const newFeat = parseSubclassFeature(feat, []);
            newFeats.push(newFeat);
        }
    }

    return newFeats;
}

export const parseSubclassFeature = (feature: string | CharacterSubclassFeature, subclassFeatures: ICharacterSubclassFeature[] = []): CharacterSubclassFeature => {
    //College of Tragedy|Bard|PHB|Tragedy|TDCSR|3
    if (typeof (feature) == 'string') {
        const [name, className, classSource, shortName, source, level] = feature.split('|');
        const classFeature = subclassFeatures.find(cf => cf.name == name && cf.className == className && cf.source == source);
        return {
            name: name.trim(),
            source: source.trim(),
            shortName: shortName.trim(),
            className: className.trim(),
            classSource: classSource.trim(),
            level: Number(level.trim()),
            description: classFeature ? normalizeEntriesToText(classFeature.entries) : ''
        }
    } else {
        const classFeature = subclassFeatures.filter(cf => cf && cf.name).find(cf => cf.name == feature.name && cf.className == feature.className && cf.source == feature.source);
        return { ...feature, description: classFeature ? normalizeEntriesToText(classFeature.entries) : '' };
    }
}

export const loadSubclasses = async (className: string): Promise<ICharacterSubclass[]> => {
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

export const loadSubclassesFeatures = async (subclasses: CharacterSubclass[]): Promise<ICharacterSubclassFeature[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const features: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [key, value] of Object.entries(index)) {
        const temp = await import(`../../data/class/${value}`);
        features.push(temp.subclassFeature?.filter((c: { subclassShortName: string, source: string; classSource: string }) =>
            (subclasses.find(subclass => subclass.shortName == c.subclassShortName && subclass.source == c.source))));
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
