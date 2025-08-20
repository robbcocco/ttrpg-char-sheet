import { useCharacter } from "@/store/5e2024/character-store";
import { CharacterInitiative } from "@/types/5e2024/character";
import { formatModifier } from "@/utils";

export default function CombatSection() {
  const { character } = useCharacter();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Combat</h2>
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-600">
          {formatModifier(CharacterInitiative(character))}
        </div>
        <div className="text-sm text-gray-500">Initiative</div>
      </div>
    </div>
  );
}
