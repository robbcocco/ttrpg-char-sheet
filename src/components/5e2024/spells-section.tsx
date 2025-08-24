import { characterActions, useCharacter, useCharacterClasses, useCharacterSpells } from "@/store/5e2024/character-store";
import { ICharacterSpell, loadSpells } from "@/types/5e2024/character-spell";
import { useEffect, useState } from "react";

export default function SpellsSection() {
  const characterClasses = useCharacterClasses();
  const characterSpells = useCharacterSpells();
  const { dispatch } = useCharacter();
  const [availableSpells, setAvailableSpells] = useState<ICharacterSpell[]>([]);

  const onAddSpell = (spellData: ICharacterSpell) => {
    dispatch(characterActions.addSpell(spellData));
  };

  const onRemoveSpell = (index: number) => {
    dispatch(characterActions.removeSpell(index));
  };

  useEffect(() => {
    loadSpells(characterClasses).then(setAvailableSpells);
  }, [characterClasses]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Spells</h2>

      {/* Spellcasting Info */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {characterClasses.map((characterClass, index) => (
            characterClass.spellcastingAbility && (
              <div key={index}>
                <span className="text-sm font-medium text-gray-700">
                  {characterClass.name}: {characterClass.spellcastingAbility.toUpperCase()}
                </span>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Add Spell */}
      <div className="mb-4">
        <select
          onChange={(e) => {
            if (e.target.value) {
              const { spellName, spellSource } = JSON.parse(e.target.value);
              const spellData = availableSpells.find(s => s.name === spellName && s.source === spellSource);
              if (spellData) onAddSpell(spellData);
              e.target.value = '';
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue=""
        >
          <option value="">Add a spell...</option>
          {availableSpells
            .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
            .map(spell => (
              <option key={`${spell.name}-${spell.source}`} value={`${JSON.stringify({ spellName: spell.name, spellSource: spell.source })}`}>
                {spell.name} [{spell.level > 0 ? `Lvl: ${spell.level}` : `Cantrip`}] ({spell.source})
              </option>
            ))
          }
        </select>
      </div>

      {/* Current Spells */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {characterSpells.length === 0 ? (
          <p className="text-gray-500 col-span-2">No spells selected</p>
        ) : (
          characterSpells.map((spell, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-3">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{spell.name}</h3>
                <button
                  onClick={() => onRemoveSpell(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  ×
                </button>
              </div>
              <div className="text-sm text-gray-600">
                <p>{spell.level > 0 ? `Level: ${spell.level}` : `Cantrip`}</p>
                <p>Range: {spell.range.type === 'point' ? `${spell.range.distance.amount} ${spell.range.distance.type}` : spell.range.type}</p>
                <p>Duration: {spell.duration.map(d => `${d.duration?.amount || ''} ${d.duration?.type || d.type}`).join(', ')}</p>
                <p>Components: {Object.entries(spell.components).filter(([, value]) => value).map(([key]) => key.toUpperCase()).join(', ')}</p>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-700">{spell.description.substring(0, 150)}...</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
