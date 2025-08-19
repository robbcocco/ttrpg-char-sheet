import { Character } from "@/types/5e2024/character";
import { formatModifier } from "@/utils/dice";

interface CombatSectionProps {
  character: Character;
}

export default function CombatSection({ character }: CombatSectionProps) {
  const dexModifier = character.abilityScores.find(a => a.key === 'dex')?.modifier() || 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Combat</h2>
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-600">
          {formatModifier(dexModifier)}
        </div>
        <div className="text-sm text-gray-500">Initiative</div>
      </div>
    </div>
  );
}
