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
    shield: CharacterItem;
}

export const initCharacterEquip = (equip?: CharacterEquip) => { return {
    weapon: equip?.weapon ?? initCharacterItem(),
    armor: equip?.armor ?? initCharacterItem(),
    shield: equip?.shield ?? initCharacterItem(),
}}

export type CharacterItem = {
    name: string;
    source: string;
    type?: 'weapon' | 'armor' | 'shield';
    weight?: number;
    dmg1?: string;
    dmgType?: string;
    dmg2?: string;
    weaponType?: string;
    armorType?: 'Light' | 'Medium' | 'Heavy'
    ac?: number;
}

export const initCharacterItem = (item?: ICharacterWeapon | ICharacterArmor | ICharacterShield | CharacterItem): CharacterItem => {
    if (item && 'weapon' in item) {
        return {
            name: item.name,
            source: item.source,
            dmg1: item.dmg1,
            dmgType: item.dmgType,
            dmg2: item.dmg2,
            weight: item?.weight ?? 0,
            weaponType: item.weaponCategory,
            type: 'weapon'
        }
    } else if (item && 'armor' in item) {
        let armorType: CharacterItem['armorType'];
        if (item.type.startsWith('LA')) armorType = 'Light';
        if (item.type.startsWith('MA')) armorType = 'Medium';
        if (item.type.startsWith('HA')) armorType = 'Heavy';
        return {
            name: item.name,
            source: item.source,
            weight: item.weight,
            ac: item.ac,
            armorType: armorType,
            type: 'armor'
        }
    } else if (item && item.type == 'S') {
        return {
            name: item.name,
            source: item.source,
            weight: item.weight,
            ac: item.ac,
            type: 'shield'
        }
    } else {
        return {
            name: item?.name ?? '',
            source: item?.source ?? '',
            weight: item?.weight,
            dmg1: item?.dmg1,
            dmgType: item?.dmgType,
            dmg2: item?.dmg2,
            weaponType: item?.weaponType,
            ac: item?.ac,
            armorType: item?.armorType,
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

export const loadShields = (): ICharacterShield[] => {
    return items.filter(item => item.type == 'S').map(item => item as ICharacterShield);
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

export interface ICharacterShield {
    name: string;
    source: string;
    page: number;
    srd: boolean;
    basicRules: boolean;
    reprintedAs: string[];
    edition: string;
    type: 'S';
    rarity: string;
    weight: number;
    value: number;
    ac: number;
    stealth: boolean;
    entries: string[];
}
