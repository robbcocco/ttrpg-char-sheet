import { normalizeEntriesToText } from '@/utils/json';
import index from '../../data/spells/index.json';

export type CharacterSpell = {
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
}

export const initCharacterSpell = (spell?: ICharacterSpell | CharacterSpell): CharacterSpell => {
    if (spell && 'page' in spell) {
        return {
            name: spell.name,
            source: spell.source,
            level: spell.level,
            school: spell.school,
            time: spell.time,
            range: spell.range,
            components: spell.components,
            duration: spell.duration,
            description: normalizeEntriesToText<ICharacterSpell['entries']>(spell.entries),
            descriptionHigherLevel: spell.entriesHigherLevel?.filter(ehl => ehl.type == 'entries').map(ehl => {
                return `${ehl.name}: ${normalizeEntriesToText<string[]>(ehl.entries)}`
            }).join(`\n`)
        }
    } else {
        return {
            name: spell?.name ?? '',
            source: spell?.source ?? '',
            level: spell?.level ?? 0,
            school: spell?.school ?? '',
            time: spell?.time ?? [],
            range: spell?.range ?? {
                type: '',
                distance: {
                    type: '',
                    amount: 0
                }
            },
            components: spell?.components ?? {
                s: false,
                v: undefined,
                m: undefined
            },
            duration: spell?.duration ?? [],
            description: spell?.description ?? '',
            descriptionHigherLevel: spell?.descriptionHigherLevel ?? ''
        }
    }
}

export const loadSpells = async (): Promise<ICharacterSpell[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spells: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [key, value] of Object.entries(index)) {
        const temp = await import(`../../data/spells/${value}`);
        spells.push(temp.spell);
    }

    return spells.flat();
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
