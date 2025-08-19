import { CharacterAbilityScore, AbilityKey } from "@/types/5e2024/character-ability-score";
import { formatModifier } from "@/utils/dice";

interface AbilityScoreProps {
  abilityScore: CharacterAbilityScore;
  onUpdate: (abilityKey: AbilityKey, value: number) => void;
}

export default function AbilityScore({ abilityScore, onUpdate }: AbilityScoreProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 10;
    onUpdate(abilityScore.key, value);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 capitalize">
          {abilityScore.name}
        </label>
        <input
          type="number"
          min="1"
          max="30"
          value={abilityScore.value || 10}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="ml-4 text-center">
        <div className="text-sm text-gray-500">Modifier</div>
        <div className="text-lg font-bold">
          {formatModifier(abilityScore.modifier())}
        </div>
      </div>
    </div>
  );
}
