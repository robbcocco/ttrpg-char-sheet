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
            <EquipSection />
          </div>

          <div className="lg:col-span-6">
            <SpellsSection />
          </div>

          <div className="lg:col-span-6">
            <FeatsSection />
          </div>

          {character.abilityScores.map((abilityScore) => (
            <div key={abilityScore.key} className="lg:col-span-2">
              <AbilitySection
                abilityScore={abilityScore}
              />
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
