'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Character, initCharacter } from '@/types/5e2024/character';
import { initCharacterClass, ICharacterClass } from '@/types/5e2024/character-class';
import { ICharacterSubclass, initCharacterSubclass } from '@/types/5e2024/character-subclass';
import { initCharacterSpell, ICharacterSpell } from '@/types/5e2024/character-spell';
import { AbilityKey } from '@/types/5e2024/character-ability-score';
import { initCharacterBackground, ICharacterBackground } from '@/types/5e2024/character-background';
import { initCharacterItem, ICharacterArmor, ICharacterWeapon, ICharacterShield, CharacterItem } from '@/types/5e2024/character-equip';
import { initCharacterActions } from '@/types/5e2024/character-actions';
import { ICharacterFeat, initCharacterFeat } from '@/types/5e2024/character-feat';

// Action types
export type CharacterAction =
  | { type: 'UPDATE_BASIC_INFO'; field: keyof Character['info']; value: string | number }
  | { type: 'UPDATE_CHARACTER_BACKGROUND'; background?: Partial<ICharacterBackground> }
  | { type: 'ADD_CHARACTER_FEAT'; featData?: ICharacterFeat }
  | { type: 'REMOVE_CHARACTER_FEAT'; featIndex: number }
  | { type: 'UPDATE_CHARACTER_WEAPON'; weapon?: ICharacterWeapon }
  | { type: 'UPDATE_CHARACTER_ARMOR'; armor?: ICharacterArmor }
  | { type: 'UPDATE_CHARACTER_SHIELD'; shield?: ICharacterShield }
  | { type: 'ADD_CHARACTER_CLASS'; classData?: ICharacterClass }
  | { type: 'UPDATE_CLASS_LEVEL'; className: string; level: number }
  | { type: 'UPDATE_CLASS_SUBCLASS'; className: string, subclass?: ICharacterSubclass }
  | { type: 'REMOVE_CHARACTER_CLASS'; classIndex: number }
  | { type: 'ADD_SPELL'; spellData: ICharacterSpell }
  | { type: 'REMOVE_SPELL'; spellIndex: number }
  | { type: 'UPDATE_ABILITY_SCORE'; abilityKey: AbilityKey; value: number }
  | { type: 'TOGGLE_SKILL_PROFICIENCY'; skillName: string }
  | { type: 'TOGGLE_SAVING_THROW_PROFICIENCY'; key: string }
  | { type: 'SET_CHARACTER'; character: Character };

// Character reducer
export function characterReducer(state: Character, action: CharacterAction): Character {
  switch (action.type) {
    case 'UPDATE_BASIC_INFO':
      return {
        ...state,
        info: { ...state.info, [action.field]: action.value }
      };

    case 'UPDATE_CHARACTER_BACKGROUND':
      const newBackground = initCharacterBackground(action.background as ICharacterBackground);
      return {
        ...state,
        background: newBackground
      };

    case 'ADD_CHARACTER_FEAT':
      if (action.featData) {
        const newFeat = initCharacterFeat(action.featData);
        return initCharacter({
          ...state,
          feats: [...state.feats, newFeat]
        });
      }
      return state;

    case 'REMOVE_CHARACTER_FEAT':
      const filteredFeats = state.feats.filter((f, i) => i != action.featIndex);
      return {
        ...state,
        feats: filteredFeats
      };

    case 'UPDATE_CHARACTER_WEAPON':
      const newWeapon = initCharacterItem(action.weapon);
      const newActions = initCharacterActions({
        ...state,
        equip: {
          ...state.equip,
          weapon: newWeapon
        }
      });
      return {
        ...state,
        actions: newActions,
        equip: {
          ...state.equip,
          weapon: newWeapon
        }
      };

    case 'UPDATE_CHARACTER_ARMOR':
      const newArmor = initCharacterItem(action.armor);
      return {
        ...state,
        equip: {
          ...state.equip,
          armor: newArmor
        }
      };

    case 'UPDATE_CHARACTER_SHIELD':
      const newShield = initCharacterItem(action.shield);
      return {
        ...state,
        equip: {
          ...state.equip,
          shield: newShield
        }
      };

    case 'ADD_CHARACTER_CLASS':
      if (action.classData) {
        const newClass = initCharacterClass(action.classData);
        return initCharacter({
          ...state,
          classes: [...state.classes, newClass]
        });
      }
      return state;

    case 'UPDATE_CLASS_LEVEL':
      const newClasses = [...state.classes];
      const classToUpdate = newClasses.find(cls => cls.name === action.className);
      // const otherClasses = newClasses.filter(cls => cls.name !== classToUpdate?.name);
      if (classToUpdate) {
        const classIndex = newClasses.indexOf(classToUpdate);
        const newClass = initCharacterClass({ ...classToUpdate, level: action.level });
        newClasses[classIndex] = newClass;
        return {
          ...state,
          classes: newClasses
        };
      }
      return state;

    case 'UPDATE_CLASS_SUBCLASS':
      const classesWithSubclass = [...state.classes];
      const classToUpdateSubclass = classesWithSubclass.find(c => c.name === action.className);
      if (classToUpdateSubclass) {
        if (action.subclass) {
          const newSubclass = initCharacterSubclass(action.subclass);
          classToUpdateSubclass.subclass = newSubclass;
        } else {
          classToUpdateSubclass.subclass = undefined;
        }
      }
      return {
        ...state,
        classes: classesWithSubclass
      };

    case 'REMOVE_CHARACTER_CLASS':
      const filteredClasses = state.classes.filter((c, i) => i != action.classIndex);
      return {
        ...state,
        classes: filteredClasses
      };

    case 'ADD_SPELL':
      if (action.spellData) {
        const newSpell = initCharacterSpell(action.spellData);
        return {
          ...state,
          spells: [...state.spells, newSpell]
        };
      }
      return state;

    case 'REMOVE_SPELL':
      return {
        ...state,
        spells: state.spells.filter((_, index) => index !== action.spellIndex)
      };

    case 'UPDATE_ABILITY_SCORE':
      const newAbilityScores = [...state.abilityScores];
      const abilityScore = newAbilityScores.find(a => a.key === action.abilityKey);
      if (abilityScore) {
        abilityScore.value = action.value;
      }
      return {
        ...state,
        abilityScores: newAbilityScores
      };

    case 'TOGGLE_SKILL_PROFICIENCY':
      const newSkills = state.skills.map(skill => {
        if (skill.name === action.skillName) {
          return {
            ...skill,
            proficient: !skill.proficient
          };
        }
        return skill;
      });

      return {
        ...state,
        skills: newSkills
      };

    case 'TOGGLE_SAVING_THROW_PROFICIENCY':
      const newAbilityScoresForSaving = state.abilityScores.map(abilityScore => {
        if (abilityScore.key === action.key) {
          return {
            ...abilityScore,
            savingThrowProficient: !abilityScore.savingThrowProficient
          };
        }
        return abilityScore;
      });

      return {
        ...state,
        abilityScores: newAbilityScoresForSaving
      };

    case 'SET_CHARACTER':
      return action.character;

    default:
      return state;
  }
}

// Context type
export interface CharacterContextType {
  character: Character;
  dispatch: React.Dispatch<CharacterAction>;
}

// Create context
const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

// Provider component
export interface CharacterProviderProps {
  children: ReactNode;
  initialCharacter?: Character;
}

export function CharacterProvider({ children, initialCharacter }: CharacterProviderProps) {
  const [character, dispatch] = useReducer(characterReducer, initialCharacter || initCharacter());

  return React.createElement(
    CharacterContext.Provider,
    { value: { character, dispatch } },
    children
  );
}

// Hook to use the context
export function useCharacter() {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
}

// Selector hooks for specific parts of the character
export function useCharacterInfo() {
  const { character } = useCharacter();
  return character.info;
}

export function useCharacterBackground() {
  const { character } = useCharacter();
  return character.background;
}

export function useCharacterClasses() {
  const { character } = useCharacter();
  return character.classes;
}

export function useCharacterAbilityScores() {
  const { character } = useCharacter();
  return character.abilityScores;
}

export function useCharacterSkills() {
  const { character } = useCharacter();
  return character.skills;
}

export function useCharacterSpells() {
  const { character } = useCharacter();
  return character.spells;
}

export function useCharacterEquip() {
  const { character } = useCharacter();
  return character.equip;
}

// Action creators for common operations
export const characterActions = {
  updateBasicInfo: (field: keyof Character['info'], value: string | number): CharacterAction => ({
    type: 'UPDATE_BASIC_INFO',
    field,
    value
  }),

  updateCharacterBackground: (background?: Partial<ICharacterBackground>): CharacterAction => ({
    type: 'UPDATE_CHARACTER_BACKGROUND',
    background
  }),

  addCharacterFeat: (featData?: ICharacterFeat): CharacterAction => ({
    type: 'ADD_CHARACTER_FEAT',
    featData
  }),

  removeCharacterFeat: (featIndex: number): CharacterAction => ({
    type: 'REMOVE_CHARACTER_FEAT',
    featIndex
  }),

  updateCharacterWeapon: (weapon?: ICharacterWeapon): CharacterAction => ({
    type: 'UPDATE_CHARACTER_WEAPON',
    weapon
  }),

  updateCharacterArmor: (armor?: ICharacterArmor): CharacterAction => ({
    type: 'UPDATE_CHARACTER_ARMOR',
    armor
  }),

  updateCharacterShield: (shield?: ICharacterShield): CharacterAction => ({
    type: 'UPDATE_CHARACTER_SHIELD',
    shield
  }),

  addCharacterClass: (classData: ICharacterClass): CharacterAction => ({
    type: 'ADD_CHARACTER_CLASS',
    classData
  }),

  updateClassLevel: (className: string, level: number): CharacterAction => ({
    type: 'UPDATE_CLASS_LEVEL',
    className,
    level
  }),

  updateClassSubclass: (className: string, subclass?: ICharacterSubclass): CharacterAction => ({
    type: 'UPDATE_CLASS_SUBCLASS',
    className,
    subclass
  }),

  removeCharacterClass: (classIndex: number): CharacterAction => ({
    type: 'REMOVE_CHARACTER_CLASS',
    classIndex
  }),

  addSpell: (spellData: ICharacterSpell): CharacterAction => ({
    type: 'ADD_SPELL',
    spellData
  }),

  removeSpell: (spellIndex: number): CharacterAction => ({
    type: 'REMOVE_SPELL',
    spellIndex
  }),

  updateAbilityScore: (abilityKey: AbilityKey, value: number): CharacterAction => ({
    type: 'UPDATE_ABILITY_SCORE',
    abilityKey,
    value
  }),

  toggleSkillProficiency: (skillName: string): CharacterAction => ({
    type: 'TOGGLE_SKILL_PROFICIENCY',
    skillName
  }),

  toggleSavingThrowProficiency: (key: string): CharacterAction => ({
    type: 'TOGGLE_SAVING_THROW_PROFICIENCY',
    key
  }),

  setCharacter: (character: Character): CharacterAction => ({
    type: 'SET_CHARACTER',
    character
  })
};
