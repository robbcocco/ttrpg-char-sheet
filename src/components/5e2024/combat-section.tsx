import { useCharacter } from "@/store/5e2024/character-store";
import { CharacterArmorClass, CharacterHitPoints, CharacterInitiative } from "@/types/5e2024/character";
import { formatModifier } from "@/utils";
import DiceRoller from "../commons/dice-roller";

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
    </div>
  );
}
