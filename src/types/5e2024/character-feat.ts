import { normalizeEntriesToText } from "@/utils/json";
import { feat as feats } from '../../data/feats.json';

export type CharacterFeat = {
    name: string,
    source: string,
    description?: string
}

export const initCharacterFeat = (feat: ICharacterFeat | CharacterFeat): CharacterFeat => {
    if (feat && 'page' in feat) {
        return {
            name: feat.name,
            source: feat.source,
            description: feat.entries ? normalizeEntriesToText<ICharacterFeat['entries']>(feat.entries) : '',
        }
    } else {
        return {
            name: feat?.name ?? '',
            source: feat?.source ?? '',
            description: feat?.description ?? '',
        }
    }
}


export const loadFeats = (): ICharacterFeat[] => {
    return feats;
}

export interface ICharacterFeat {
    name: string;
    source: string;
    page: number;
    prerequisite?: unknown[];
    ability?: unknown[];
    additionalSpells?: unknown[];
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
