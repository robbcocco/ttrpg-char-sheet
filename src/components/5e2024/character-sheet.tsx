'use client';

import { useState } from 'react';
import { Character } from '@/types/5e2024/character';
import { CharacterClass, CharacterSubclass, ICharacterClass, ICharacterSubclass } from '@/types/5e2024/character-class';
import { CharacterSpell, ICharacterSpell } from '@/types/5e2024/character-spell';
import BasicInfo from '../sheet/basic-info';
import CombatSection from '../sheet/combat-section';
import SpellsSection from '../sheet/spells-section';
import { AbilityKey } from '@/types/5e2024/character-ability-score';
import { CharacterBackground, ICharacterBackground } from '@/types/5e2024/character-background';
import AbilitySection from '../sheet/ability-section';
import EquipSection from '../sheet/equip-section';
import { CharacterItem, ICharacterArmor, ICharacterWeapon } from '@/types/5e2024/character-equip';

export default function CharacterSheet() {
  const [character, setCharacter] = useState<Character>(new Character());

  const updateBasicInfo = (field: keyof Character['info'], value: string | number) => {
    setCharacter(prev => ({
      ...prev,
      info: { ...prev.info, [field]: value }
    }));
  };

  const updateCharacterBackground = (background: Partial<ICharacterBackground>) => {
    if (background) {
      const newBackground = new CharacterBackground(background);
      setCharacter(prev => ({
        ...prev,
        info: {
          ...prev.info,
          background: newBackground
        }
      }));
    }
  };

  const updateCharacterWeapon = (weapon: ICharacterWeapon) => {
    if (weapon) {
      const newWeapon = new CharacterItem(weapon);
      setCharacter(prev => ({
        ...prev,
        equip: {
          ...prev.equip,
          weapon: newWeapon
        }
      }));
    }
  };

  const updateCharacterArmor = (armor: ICharacterArmor) => {
    if (armor) {
      const newArmor = new CharacterItem(armor);
      setCharacter(prev => ({
        ...prev,
        equip: {
          ...prev.equip,
          armor: newArmor
        }
      }));
    }
  };

  const addCharacterClass = (classData: ICharacterClass) => {
    if (classData) {
      const newClass = new CharacterClass(classData);
      setCharacter(prev => ({
        ...prev,
        info: {
          ...prev.info,
          classes: [...prev.info.classes, newClass]
        }
      }));
    }
  };

  const updateClassLevel = (className: string, level: number) => {
    setCharacter(prev => {
      const newClasses = [...prev.info.classes];
      const newClass = newClasses.find(ncls => ncls.name == className);
      if (newClass) newClass.level = level;
      return {
        ...prev,
        info: {
          ...prev.info,
          classes: newClasses
        }
      };
    });
  };

  const updateClassSubclass = (className: string, subclass: ICharacterSubclass) => {
    setCharacter(prev => {
      const newClasses = [...prev.info.classes];
      const classIndex = newClasses.findIndex(ncls => ncls.name == className);
      newClasses[classIndex].subclass = new CharacterSubclass(subclass);
      return {
        ...prev,
        info: {
          ...prev.info,
          classes: newClasses
        }
      };
    });
  };

  const removeCharacterClass = (classIndex: number) => {
    setCharacter(prev => {
      const newClasses = prev.info.classes.filter((_, index) => index !== classIndex);
      return {
        ...prev,
        info: {
          ...prev.info,
          classes: newClasses
        }
      };
    });
  };

  const addSpell = (spellData: ICharacterSpell) => {
    if (spellData) {
      const newSpell = new CharacterSpell(spellData);
      setCharacter(prev => ({
        ...prev,
        spells: [...prev.spells, newSpell]
      }));
    }
  };

  const removeSpell = (spellIndex: number) => {
    setCharacter(prev => ({
      ...prev,
      spells: prev.spells.filter((_, index) => index !== spellIndex)
    }));
  };

  const updateAbilityScore = (abilityKey: AbilityKey, value: number) => {
    setCharacter(prev => {
      const newAbilityScores = [...prev.abilityScores];
      const abilityScore = newAbilityScores.find(a => a.key === abilityKey);
      if (abilityScore) {
        abilityScore.value = value;
      }
      return {
        ...prev,
        abilityScores: newAbilityScores
      };
    });
  };

  const toggleSkillProficiency = (skillName: string) => {
    setCharacter(prev => {
      const newCharacter = { ...prev };
      const newSkills = prev.skills.map(skill => {
        if (skill.name === skillName) {
          // Create a new skill object with toggled proficiency
          const newSkill = Object.create(Object.getPrototypeOf(skill));
          Object.assign(newSkill, skill);
          newSkill.proficient = !skill.proficient;

          // Recreate the score function to reference the updated character and skill
          newSkill.score = function (): number {
            const base = newCharacter.abilityScores.find((a) => a.key === (skill.ability as AbilityKey))?.modifier() ?? 0;
            return this.proficient ? base + Number(newCharacter.info.proficiencyBonus) : base;
          };

          return newSkill;
        }
        return skill;
      });

      newCharacter.skills = newSkills;
      return newCharacter;
    });
  };


  const toggleSavingThrowProficiency = (key: string) => {
    setCharacter(prev => {
      const newCharacter = { ...prev };
      const newAbilityScores = prev.abilityScores.map(abilityScore => {
        if (abilityScore.key === key) {
          // Create a new skill object with toggled proficiency
          const newAbility = Object.create(Object.getPrototypeOf(abilityScore));
          Object.assign(newAbility, abilityScore);
          newAbility.savingThrowProficient = !abilityScore.savingThrowProficient;

          // Recreate the score function to reference the updated character and skill
          newAbility.savingThrow = function (): number {
            return this.savingThrowProficient ? this.modifier() + Number(newCharacter.info.proficiencyBonus) : this.modifier();
          };

          return newAbility;
        }
        return abilityScore;
      });

      newCharacter.abilityScores = newAbilityScores;
      return newCharacter;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">D&D 5e Character Sheet</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <BasicInfo
            character={character}
            onUpdate={updateBasicInfo}
            onUpdateBackground={updateCharacterBackground}
            onAddClass={addCharacterClass}
            onUpdateClassLevel={updateClassLevel}
            onUpdateClassSubclass={updateClassSubclass}
            onRemoveClass={removeCharacterClass}
          />

          {character.abilityScores.map((abilityScore) => (
            <AbilitySection
              key={abilityScore.key}
              abilityScore={abilityScore}
              skills={character.skills}
              onUpdateAbility={updateAbilityScore}
              onToggleSavingThrow={toggleSavingThrowProficiency}
              onToggleSkillProficiency={toggleSkillProficiency} />
          ))}

          {/* <AbilityScoresSection
            character={character}
            onUpdateAbilityScore={updateAbilityScore}
          /> */}

          <CombatSection character={character} />

          {/* <SkillsSection
            character={character}
            onToggleSkillProficiency={toggleSkillProficiency}
          /> */}

          {/* <SavingThrowsSection
            character={character}
            onToggleSavingThrowsProficiency={toggleSavingThrowProficiency}
          /> */}

          <EquipSection
            character={character}
            onUpdateWeapon={updateCharacterWeapon}
            onUpdateArmor={updateCharacterArmor}
          />

          <div className="lg:col-span-3">
            <SpellsSection
              character={character}
              onAddSpell={addSpell}
              onRemoveSpell={removeSpell}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
