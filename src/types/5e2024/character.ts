import { reduceDices } from '@/utils/dice';
import { AbilityName, AbilityKey, CharacterAbilityScore, initCharacterAbilityScore, CharacterAbilityModifier } from './character-ability-score';
import { CharacterBackground } from './character-background';
import { CharacterClass, CharacterClassFeature, CharacterClassUnlockedFeats, CharacterProficiency } from './character-class';
import { CharacterEquip, initCharacterEquip } from './character-equip';
import { CharacterInfo, initCharacterInfo } from './character-info';
import { CharacterSkill, CharacterSkillProficiency, initCharacterSkill, loadSkills, sortCharacterSkillProficiencies } from './character-skill';
import { CharacterSpell } from './character-spell';
import { CharacterAction, initCharacterActions } from './character-actions';
import { CharacterSubclassFeature } from './character-subclass';
import { CharacterFeat } from './character-feat';

export type Character = {
    info: CharacterInfo

    background?: CharacterBackground;

    feats: CharacterFeat[];

    classes: CharacterClass[];

    abilityScores: CharacterAbilityScore[];

    skills: CharacterSkill[];

    actions: CharacterAction[];

    spells: CharacterSpell[];

    equip: CharacterEquip;
}

export const initCharacter = (character?: Character): Character => {
    const proficiencies = CharacterAbilityProficiencies(character);
    const { skills } = CharacterProficiencies(character);
    
    return {
        info: character?.info ?? initCharacterInfo(),
        background: character?.background ?? undefined,
        feats: character?.feats ?? [],
        classes: character?.classes ?? [],
        abilityScores: // character?.abilityScores ?? abilities.map(ability => initCharacterAbilityScore(ability, proficiencies)),
        (character?.abilityScores?.length ?? 0) > 0 
            ? character!.abilityScores.map(ability => {
                return initCharacterAbilityScore(ability, proficiencies);
            })
            : abilities.map(ability => {
                return initCharacterAbilityScore(ability, proficiencies);
            }),
        actions: initCharacterActions(),
        skills: character?.skills.map(skill => initCharacterSkill(skill, skills)) ?? loadSkills().map(skill => initCharacterSkill(skill, skills)),
        spells: [],
        equip: initCharacterEquip()
    }
}

export const CharacterInitiative = (character: Character): number => {
    const dexterity = character.abilityScores.find(a => a.key === 'dex');
    return dexterity ? CharacterAbilityModifier(dexterity) : 0;
}

export const CharacterArmorClass = (character: Character): number => {
    const baseAC = 10;
    let armorClass;

    const dexterity = character.abilityScores.find(a => a.key === 'dex');
    const dexModifier = CharacterAbilityModifier(dexterity);

    const armor = character.equip?.armor;
    if (armor?.ac) {
        const isHeavy = armor.armorType == 'Heavy';
        const isMedium = armor.armorType == 'Medium';
        if (isHeavy) {
            armorClass = baseAC + armor.ac;
        } else if (isMedium) {
            armorClass = baseAC + armor.ac + Math.min(dexModifier, 2);
        } else {
            armorClass = baseAC + armor.ac + dexModifier;
        }
    } else {
        armorClass = dexterity ? baseAC + dexModifier : baseAC;
    }

    const shield = character.equip?.shield;
    if (shield?.ac) {
        armorClass += shield.ac;
    }

    return armorClass;
}

export const CharacterHitPoints = (character: Character): number => {
    let baseHitPoints = 0;

    const constitution = character.abilityScores.find(a => a.key === 'con');
    const conModifier = CharacterAbilityModifier(constitution);
    const classesHealthDices = reduceDices(character.classes.map(({ level, healthDice }) => ({
        number: level,
        faces: healthDice
    })));

    for (let i = 0; i < classesHealthDices.length; i++) {
        const { faces } = classesHealthDices[i];

        if (i == 0) {
            baseHitPoints += faces + conModifier;
        } else {
            baseHitPoints += (faces / 2) + 1 + conModifier;
        }
    }

    return baseHitPoints;
}

export const CharacterAbilityProficiencies = (character?: Character): AbilityKey[] => {
    const mainClass = character?.classes[0];
    return mainClass ? mainClass.proficiency : [];
}

export const CharacterProficiencies = (character?: Character): CharacterProficiency => {
    const [mainClass, ...multiClasses] = character?.classes ?? [];
    const characterSkills = character?.skills ?? [];

    let weapons: string[] = [];
    let armor: string[] = [];
    let skillProficiencies: CharacterSkillProficiency[] = [];

    if (mainClass) {
        weapons = [...new Set([...weapons, ...mainClass.startingProficiencies.weapons])];
        armor = [...new Set([...armor, ...mainClass.startingProficiencies.armor])];
        skillProficiencies = skillProficiencies.concat(mainClass.startingProficiencies.skills);

        for (const mc of multiClasses) {
            weapons = [...new Set([...weapons, ...mc.multiclassProficiencies.weapons])];
            armor = [...new Set([...armor, ...mc.multiclassProficiencies.armor])];
            skillProficiencies = skillProficiencies.concat(mc.multiclassProficiencies.skills);
        }
    }

    if (character?.background) {
        skillProficiencies = skillProficiencies.concat(character.background.proficiencies);
    }

    skillProficiencies = sortCharacterSkillProficiencies(skillProficiencies);
    for (const characterSkill of characterSkills) {
        if (characterSkill.proficient) {
            const skillProficiency = skillProficiencies.find(skillProficiency =>
                (typeof(skillProficiency)  == 'string' && skillProficiency.toLowerCase() == characterSkill.name.toLowerCase()) ||
                (typeof(skillProficiency)  != 'string' &&
                skillProficiency.from.map(f => f.toLowerCase()).includes(characterSkill.name.toLowerCase()) &&
                (skillProficiency.used.includes(characterSkill.name) || skillProficiency.used.length < skillProficiency.count))
            );
            if (skillProficiency && typeof(skillProficiency) != 'string') {
                skillProficiency.used = [...new Set([characterSkill.name, ...skillProficiency.used])];
            }
        } else {
            const skillProficienciesFiltered = skillProficiencies.filter(skillProficiency =>
                typeof(skillProficiency) != 'string' &&
                skillProficiency.used.map(f => f.toLowerCase()).includes(characterSkill.name.toLowerCase()));
            for (const skillProficiency of skillProficienciesFiltered) {
                if (skillProficiency && typeof(skillProficiency) != 'string') {
                    skillProficiency.used = skillProficiency.used.filter(use => use != characterSkill.name);
                }
            }
        }
    }

    return {
        weapons: weapons,
        armor: armor,
        skills: skillProficiencies
    };
}

export const CharacterFeats = (character?: Character): (CharacterClassFeature | CharacterSubclassFeature)[] => {
    let feats: (CharacterClassFeature | CharacterSubclassFeature)[] = [];

    for (const characterClass of character?.classes ?? []) {
        feats = feats.concat(CharacterClassUnlockedFeats(characterClass));
    }

    return feats;
}

const abilities: Array<[AbilityName, AbilityKey]> = [
    ['strength', 'str'],
    ['dexterity', 'dex'],
    ['constitution', 'con'],
    ['intelligence', 'int'],
    ['wisdom', 'wis'],
    ['charisma', 'cha']
];
