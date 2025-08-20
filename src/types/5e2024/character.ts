import { AbilityName, AbilityKey, CharacterAbilityScore, initCharacterAbilityScore, CharacterAbilityModifier } from './character-ability-score';
import { CharacterBackground } from './character-background';
import { CharacterClass } from './character-class';
import { CharacterEquip, initCharacterEquip } from './character-equip';
import { CharacterInfo, initCharacterInfo } from './character-info';
import { CharacterSkill, initCharacterSkill, loadSkills } from './character-skill';
import { CharacterSpell } from './character-spell';

export type Character = {
    // constructor() {
    //     // eslint-disable-next-line @typescript-eslint/no-this-alias
    //     const that = this;

    //     this.info = new CharacterInfo()

    //     // Init array
    //     this.abilityScores = [];
    //     this.skills = [];
    //     const abilities: Array<[AbilityName, AbilityKey]> = [
    //         ['strength', 'str'],
    //         ['dexterity', 'dex'],
    //         ['constitution', 'con'],
    //         ['intelligence', 'int'],
    //         ['wisdom', 'wis'],
    //         ['charisma', 'cha']
    //     ];

    //     for (const ability of abilities) {
    //         const ab = new CharacterAbilityScore(ability[0], ability[1])
    //         ab.savingThrow = function (): number {
    //             return this.savingThrowProficient ? this.modifier() + Number(that.info.proficiencyBonus) : this.modifier();
    //         };
    //         this.abilityScores.push(ab);
    //     }

    //     for (const skill of CharacterSkill.loadSkills()) {
    //         const sk = new CharacterSkill(skill);

    //         // 2) Replace the score function so it can close over *this* Character and the skill instance
    //         sk.score = function (): number {
    //             const base =
    //                 that.abilityScores.find((a) => a.key === (sk.ability as AbilityKey))?.modifier() ?? 0;
    //             return this.proficient ? base + Number(that.info.proficiencyBonus) : base;
    //         };

    //         this.skills.push(sk);
    //     }

    //     this.spells = [];
    // }

    info: CharacterInfo

    background?: CharacterBackground;

    classes: CharacterClass[];

    abilityScores: CharacterAbilityScore[];

    skills: CharacterSkill[];

    spells: CharacterSpell[];

    equip: CharacterEquip;
}

export const initChatacter = (character?: Character): Character => { return {
    info: character?.info ?? initCharacterInfo(),
    background: character?.background ?? undefined,
    classes: character?.classes ?? [],
    abilityScores: character?.abilityScores ?? abilities.map(ability => initCharacterAbilityScore(ability)),
    skills: loadSkills().map(skill => initCharacterSkill(skill)),
    spells: [],
    equip: initCharacterEquip()
}}

export const CharacterInitiative = (character: Character) => {
    const dexterity = character.abilityScores.find(a => a.key === 'dex');
    return dexterity ? CharacterAbilityModifier(dexterity) : 0;
}

const abilities: Array<[AbilityName, AbilityKey]> = [
    ['strength', 'str'],
    ['dexterity', 'dex'],
    ['constitution', 'con'],
    ['intelligence', 'int'],
    ['wisdom', 'wis'],
    ['charisma', 'cha']
];