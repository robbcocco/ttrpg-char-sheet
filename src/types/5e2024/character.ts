import { AbilityName, AbilityKey, CharacterAbilityScore } from './character-ability-score';
import { CharacterEquip } from './character-equip';
import { CharacterInfo } from './character-info';
import { CharacterSkill } from './character-skill';
import { CharacterSpell } from './character-spell';

export class Character {
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;

        this.info = new CharacterInfo()

        // Init array
        this.abilityScores = [];
        this.skills = [];
        const abilities: Array<[AbilityName, AbilityKey]> = [
            ['strength', 'str'],
            ['dexterity', 'dex'],
            ['constitution', 'con'],
            ['intelligence', 'int'],
            ['wisdom', 'wis'],
            ['charisma', 'cha']
        ];

        for (const ability of abilities) {
            const ab = new CharacterAbilityScore(ability[0], ability[1])
            ab.savingThrow = function (): number {
                return this.savingThrowProficient ? this.modifier() + Number(that.info.proficiencyBonus) : this.modifier();
            };
            this.abilityScores.push(ab);
        }

        for (const skill of CharacterSkill.loadSkills()) {
            const sk = new CharacterSkill(skill);

            // 2) Replace the score function so it can close over *this* Character and the skill instance
            sk.score = function (): number {
                const base =
                    that.abilityScores.find((a) => a.key === (sk.ability as AbilityKey))?.modifier() ?? 0;
                return this.proficient ? base + Number(that.info.proficiencyBonus) : base;
            };

            this.skills.push(sk);
        }

        this.spells = [];
    }

    info: CharacterInfo

    abilityScores: CharacterAbilityScore[];

    skills: CharacterSkill[];

    spells: CharacterSpell[];

    equip: CharacterEquip;
}
