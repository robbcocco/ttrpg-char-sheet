import { normalizeEntriesToText } from "@/utils/json";
import { background as backgrounds } from '../../data/backgrounds.json';

export class CharacterBackground {
    constructor(
        background: Partial<ICharacterBackground>
    ) {
        this.name = background.name ?? '';
        this.source = background.source ?? '';
        this.description = background.entries ? normalizeEntriesToText<ICharacterBackground['entries']>(background.entries) : '';
        this.proficiencies = [];
    }

    name: string;
    source: string;
    description: string;
    ability: string;
    proficiencies: string[];

    static loadBackgrounds(): Partial<ICharacterBackground>[] {
        return backgrounds
            // .filter(background => background.source == 'XPHB')
            .sort((a, b) => a.name.localeCompare(b.name));
    }
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
