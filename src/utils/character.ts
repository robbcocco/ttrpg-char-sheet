import { Character, SKILLS, SAVING_THROWS } from '@/types/character';
import { getAbilityModifier, getProficiencyBonus } from './dice';

export function createDefaultCharacter(): Character {
  const skills: Character['skills'] = {};
  SKILLS.forEach(skill => {
    skills[skill.name] = {
      proficient: false,
      value: 0
    };
  });

  const savingThrows: Character['savingThrows'] = {};
  SAVING_THROWS.forEach(save => {
    savingThrows[save] = {
      proficient: false,
      value: 0
    };
  });

  return {
    basicInfo: {
      name: '',
      class: '',
      level: 1,
      race: '',
      background: '',
      alignment: '',
      experiencePoints: 0
    },
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    skills,
    combat: {
      armorClass: 10,
      hitPoints: {
        current: 8,
        maximum: 8,
        temporary: 0
      },
      hitDice: '1d8',
      speed: 30,
      initiative: 0
    },
    savingThrows,
    proficiencies: [],
    languages: [],
    equipment: [],
    spells: {
      spellcastingAbility: '',
      spellSaveDC: 8,
      spellAttackBonus: 0,
      cantrips: [],
      level1: [],
      level2: [],
      level3: [],
      level4: [],
      level5: [],
      level6: [],
      level7: [],
      level8: [],
      level9: []
    },
    features: [],
    notes: ''
  };
}

export function calculateSkillModifier(
  character: Character,
  skillName: string
): number {
  const skill = SKILLS.find(s => s.name === skillName);
  if (!skill) return 0;

  const abilityModifier = getAbilityModifier(character.abilityScores[skill.ability]);
  const proficiencyBonus = character.skills[skillName]?.proficient 
    ? getProficiencyBonus(character.basicInfo.level) 
    : 0;

  return abilityModifier + proficiencyBonus;
}

export function calculateSavingThrowModifier(
  character: Character,
  savingThrow: string
): number {
  const abilityModifier = getAbilityModifier(
    character.abilityScores[savingThrow as keyof Character['abilityScores']]
  );
  const proficiencyBonus = character.savingThrows[savingThrow]?.proficient 
    ? getProficiencyBonus(character.basicInfo.level) 
    : 0;

  return abilityModifier + proficiencyBonus;
}

export function calculateInitiative(character: Character): number {
  return getAbilityModifier(character.abilityScores.dexterity);
}

export function exportCharacterToJSON(character: Character): string {
  return JSON.stringify(character, null, 2);
}

export function importCharacterFromJSON(jsonString: string): Character | null {
  try {
    const character = JSON.parse(jsonString);
    // Basic validation
    if (!character.basicInfo || !character.abilityScores || !character.skills) {
      return null;
    }
    return character as Character;
  } catch (error) {
    console.error('Error parsing character JSON:', error);
    return null;
  }
}

export function saveCharacterToLocalStorage(character: Character, slot: string = 'default'): void {
  try {
    localStorage.setItem(`dnd-character-${slot}`, exportCharacterToJSON(character));
  } catch (error) {
    console.error('Error saving character to localStorage:', error);
  }
}

export function loadCharacterFromLocalStorage(slot: string = 'default'): Character | null {
  try {
    const saved = localStorage.getItem(`dnd-character-${slot}`);
    if (!saved) return null;
    return importCharacterFromJSON(saved);
  } catch (error) {
    console.error('Error loading character from localStorage:', error);
    return null;
  }
}
