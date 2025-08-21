import { Dice, parseDice } from "@/utils/dice";
import { Character } from "./character";

export type CharacterAction = {
    name: string;
    dice: Dice;
    type: string;
}

export const initCharacterActions = (character?: Character): CharacterAction[] => {
    const actions: CharacterAction[] = [];

    actions.push({
        name: 'Unarmed Attack',
        dice: {
            number: 1,
            faces: 4
        },
        type: 'B'
    })

    const weapon = character?.equip.weapon;
    if (weapon?.dmg1) {
        actions.push({
            name: weapon.name,
            dice: parseDice(weapon.dmg1),
            type: weapon.dmgType ?? ''
        })
    }
    if (weapon?.dmg2) {
        actions.push({
            name: weapon.name,
            dice: parseDice(weapon.dmg2),
            type: weapon.dmgType ?? ''
        })
    }

    return actions;
}