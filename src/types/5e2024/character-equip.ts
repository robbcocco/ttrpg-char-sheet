import {
    baseitem as items,
    // itemProperty as itemProperties,
    // itemType as itemTypes,
    // itemTypeAdditionalEntries as itemTypeAdditionalEntries,
    // itemEntry as itemEntries,
    // itemMastery as itemMasteries
} from '../../data/items-base.json';

export type CharacterEquip = {
    weapon: CharacterItem;
    armor: CharacterItem;
}

export const initCharacterEquip = (equip?: CharacterEquip) => { return {
    weapon: equip?.weapon ?? initCharacterItem(),
    armor: equip?.armor ?? initCharacterItem()
}}

export type CharacterItem = {
    name: string;
    source: string;
    type?: 'weapon' | 'armor';
    dmg1?: string;
    dmgType?: string;
    dmg2?: string;
    ac?: number;
}

export const initCharacterItem = (item?: ICharacterWeapon | ICharacterArmor | CharacterItem): CharacterItem => {
    if (item && 'weapon' in item) {
        return {
            name: item.name,
            source: item.source,
            dmg1: item.dmg1,
            dmgType: item.dmgType,
            dmg2: item.dmg2,
            type: 'weapon'
        }
    } else if (item && 'armor' in item) {
        return {
            name: item.name,
            source: item.source,
            ac: item.ac,
            type: 'armor'
        }
    } else {
        return {
            name: item?.name ?? '',
            source: item?.source ?? '',
            dmg1: item?.dmg1 ?? '',
            dmgType: item?.dmgType ?? '',
            dmg2: item?.dmg2 ?? '',
            ac: item?.ac ?? 0,
            type: item?.type
        }
    }
}

export const loadWeapons = (): ICharacterWeapon[] => {
    return items.filter(item => item.weapon).map(item => item as ICharacterWeapon);
}

export const loadArmors = (): ICharacterArmor[] => {
    return items.filter(item => item.armor).map(item => item as ICharacterArmor);
}

export interface ICharacterWeapon {
    name: string;
    source: string;
    page: number;
    srd: boolean;
    basicRules: boolean;
    reprintedAs: string[];
    edition: string;
    type: string;
    rarity: string;
    weight: number;
    value: number;
    weaponCategory: string;
    property: string[];
    dmg1: string;
    dmgType: string;
    dmg2: string;
    weapon: boolean;
}

export interface ICharacterArmor {
    name: string;
    source: string;
    page: number;
    srd: boolean;
    basicRules: boolean;
    reprintedAs: string[];
    edition: string;
    type: string;
    rarity: string;
    weight: number;
    value: number;
    ac: number;
    armor: boolean;
    stealth: boolean;
    entries: string[];
}
