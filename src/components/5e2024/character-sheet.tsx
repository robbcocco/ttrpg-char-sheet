'use client';

import { useCharacter } from '@/store/5e2024/character-store';
import BasicInfo from './basic-info';
import CombatSection from './combat-section';
import SpellsSection from './spells-section';
import AbilitySection from './ability-section';
import EquipSection from './equip-section';
import FeatsSection from './feats-section';

export default function CharacterSheet() {
  const { character } = useCharacter();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">D&D 5e Character Sheet</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <BasicInfo />
          </div>

          <div className="lg:col-span-5">
            <CombatSection />
          </div>

          <div className="lg:col-span-3">
            <FeatsSection />
          </div>

          <div className="lg:col-span-4">
            <EquipSection />
          </div>

          <div className="lg:col-span-8">
            {!!character.classes.find(cc => cc.spellcastingAbility) && <SpellsSection />}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 lg:col-span-12 gap-6">
            {character.abilityScores.map((abilityScore) => (
              <div key={abilityScore.key} className="lg:col-span-1">
                <AbilitySection
                  abilityScore={abilityScore}
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
