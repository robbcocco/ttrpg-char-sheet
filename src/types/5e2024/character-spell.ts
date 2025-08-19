import { normalizeEntriesToText } from '@/utils/json';
import index from '../../data/spells/index.json';

export class CharacterSpell {
    constructor(spell: ICharacterSpell) {
        this.name = spell.name;
        this.source = spell.source;
        this.level = spell.level;
        this.time = spell.time;
        this.range = spell.range;
        this.components = spell.components;
        this.duration = spell.duration;
        this.description = normalizeEntriesToText<ICharacterSpell['entries']>(spell.entries);
        this.descriptionHigherLevel = spell.entriesHigherLevel?.filter(ehl => ehl.type == 'entries').map(ehl => {
            return `${ehl.name}: ${normalizeEntriesToText<string[]>(ehl.entries)}`
        }).join(`\n`)
    }

    name: string;
    source: string;
    level: number;
    school: string;
    time: {
        number: number;
        unit: string;
    }[];
    range: {
        type: string;
        distance: {
            type: string;
            amount: number;
        };
    };
    components: {
        s: boolean;
        v?: undefined;
        m?: undefined;
    };
    duration: {
        type: string;
        duration: {
            type: string;
            amount: number;
        };
    }[];
    description: string;
    descriptionHigherLevel: string;
    miscTags: string[];
    hasFluffImages: boolean;

    static loadSpells = async (): Promise<ICharacterSpell[]> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const spells: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [key, value] of Object.entries(index)) {
            const temp = await import(`../../data/spells/${value}`);
            spells.push(temp.spell);
        }

        return spells.flat();
    }
}

export interface ICharacterSpell {
    name: string;
    source: string;
    page: number;
    level: number;
    school: string;
    time: {
        number: number;
        unit: string;
    }[];
    range: {
        type: string;
        distance: {
            type: string;
            amount: number;
        };
    };
    components: {
        s: boolean;
        v?: undefined;
        m?: undefined;
    };
    duration: {
        type: string;
        duration: {
            type: string;
            amount: number;
        };
    }[];
    entries: string[];
    entriesHigherLevel: {
        type: string;
        name: string;
        entries: string[];
    }[];
}
