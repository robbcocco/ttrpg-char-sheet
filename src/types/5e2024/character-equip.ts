import {
    baseitem as items,
    // itemProperty as itemProperties,
    // itemType as itemTypes,
    // itemTypeAdditionalEntries as itemTypeAdditionalEntries,
    // itemEntry as itemEntries,
    // itemMastery as itemMasteries
} from '../../data/items-base.json';

export class CharacterEquip {
    weapon: CharacterItem;
    armor: CharacterItem;
}

export class CharacterItem {
    constructor(item: ICharacterWeapon | ICharacterArmor) {
        this.name = item.name;
        this.source = item.source;
        if ((item as ICharacterWeapon).weapon) {
            this.dmg1 = (item as ICharacterWeapon).dmg1;
            this.dmgType = (item as ICharacterWeapon).dmgType;
            this.dmg2 = (item as ICharacterWeapon).dmg2;
            this.weapon = true;
        } else if ((item as ICharacterArmor).armor) {
            this.ac = (item as ICharacterArmor).ac;
            this.armor = true;
        }
    }

    name: string;
    source: string;
    dmg1?: string;
    dmgType?: string;
    dmg2?: string;
    ac?: number;
    weapon?: boolean;
    armor?: boolean;

    static loadWeapons(): ICharacterWeapon[] {
        return items.filter(item => item.weapon).map(item => item as ICharacterWeapon);
    }

    static loadArmors(): ICharacterArmor[] {
        return items.filter(item => item.armor).map(item => item as ICharacterArmor);
    }
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
