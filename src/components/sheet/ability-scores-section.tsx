import { Character } from "@/types/5e2024/character";
import AbilityScore from "./ability-score";
import { AbilityKey } from "@/types/5e2024/character-ability-score";

interface AbilityScoresSectionProps {
  character: Character;
  onUpdateAbilityScore: (abilityKey: AbilityKey, value: number) => void;
}

export default function AbilityScoresSection({ character, onUpdateAbilityScore }: AbilityScoresSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Ability Scores</h2>
      <div className="space-y-4">
        {character.abilityScores.map((abilityScore) => (
          <AbilityScore
            key={abilityScore.key}
            abilityScore={abilityScore}
            onUpdate={onUpdateAbilityScore}
          />
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Proficiency Bonus: +{character.info.proficiencyBonus}
        </div>
      </div>
    </div>
  );
}
