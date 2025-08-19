export class CharacterAbilityScore {
    constructor(name: AbilityName, key: AbilityKey) {
        this.name = name;
        this.key = key;
        this.value = 10;
        this.savingThrowProficient = false;
        this.savingThrow = () => 0;
    }

    name: AbilityName;
    key: AbilityKey;
    value: number;
    savingThrowProficient: boolean;
    modifier(): number {
        return Math.floor((this.value - 10) / 2);
    };
    savingThrow: () => number;
}

export type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
export type AbilityName =
    | 'strength'
    | 'dexterity'
    | 'constitution'
    | 'intelligence'
    | 'wisdom'
    | 'charisma';