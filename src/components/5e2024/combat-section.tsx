import { useCharacter } from "@/store/5e2024/character-store";
import { CharacterArmorClass, CharacterHitPoints, CharacterInitiative } from "@/types/5e2024/character";
import { formatModifier } from "@/utils";
import DiceRoller from "../commons/dice-roller";
import { formatDice } from "@/utils/dice";

export default function CombatSection() {
  const { character } = useCharacter();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Combat</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Initiative */}
        <DiceRoller dices={[{ number: 1, faces: 20, bonus: CharacterInitiative(character) }]}>
          <div className="lg:col-span-1 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {formatModifier(CharacterInitiative(character))}
            </div>
            <div className="text-sm text-gray-500">Initiative</div>
          </div>
        </DiceRoller>
        {/* Armor Class */}
        <div className="lg:col-span-1 text-center">
          <div className="text-3xl font-bold text-blue-600">
            {formatModifier(CharacterArmorClass(character))}
          </div>
          <div className="text-sm text-gray-500">Armor Class</div>
        </div>
        {/* Hit Points */}
        <div className="lg:col-span-1 text-center">
          <div className="text-3xl font-bold text-blue-600">
            {formatModifier(CharacterHitPoints(character))}
          </div>
          <div className="text-sm text-gray-500">Hit Points</div>
        </div>
      </div>

      {/* Actions */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Actions</h4>
        <div className="space-y-1">
          {character.actions.map((action, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <div className="flex items-center space-x-2">
                <span className="text-sm">{action.name}</span>
              </div>
              <DiceRoller dices={[action.dice]}>
                <span className="font-medium">{formatDice(action.dice)}</span>
              </DiceRoller>
            </div>
          ))}
        </div>
      </div>

      {/* Spells */}
      {character.spells.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Spells</h4>
          <div className="space-y-1">
            {character.spells.map((spell, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{spell.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
