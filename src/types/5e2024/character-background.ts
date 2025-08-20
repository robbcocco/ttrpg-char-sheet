import { normalizeEntriesToText } from "@/utils/json";
import { background as backgrounds } from '../../data/backgrounds.json';

export type CharacterBackground = {
    name: string;
    source: string;
    description: string;
    ability: string;
    proficiencies: string[];
}

export const initCharacterBackground = (background?: ICharacterBackground | CharacterBackground): CharacterBackground => {
    if (background && 'page' in background) {
        return {
            name: background.name ?? '',
            source: background.source ?? '',
            description: background.entries ? normalizeEntriesToText<ICharacterBackground['entries']>(background.entries) : '',
            ability: '',
            proficiencies: []
        }
    } else {
        return {
            name: background?.name ?? '',
            source: background?.source ?? '',
            description: background?.description ?? '',
            ability: '',
            proficiencies: []
        }
    }
}

export const loadBackgrounds = (): Partial<ICharacterBackground>[] => {
    return backgrounds
        // .filter(background => background.source == 'XPHB')
        .sort((a, b) => a.name.localeCompare(b.name));
}

export interface ICharacterBackground {
    name: string;
    source: string;
    page: number;
    feats: unknown[];
    srd: boolean;
    basicRules: boolean;
    reprintedAs: string[];
    skillProficiencies: unknown[];
    languageProficiencies: unknown[];
    startingEquipment: unknown[];
    entries: unknown[];
    weaponProficiencies?: unknown;
}
