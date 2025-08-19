import { Character } from "@/types/5e2024/character";
import SavingThrowScore from "./saving-throws-score";

interface SavingThrowsSectionProps {
  character: Character;
  onToggleSavingThrowsProficiency: (key: string) => void;
}

export default function SavingThrowsSection({ character, onToggleSavingThrowsProficiency }: SavingThrowsSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Saving Throws</h2>
      <div className="space-y-3">
        {character.abilityScores.map((abilityScore) => (
          <SavingThrowScore
            key={abilityScore.key}
            abilityScore={abilityScore}
            onToggleProficiency={onToggleSavingThrowsProficiency}
          />
        ))}
      </div>
    </div>
  );
}
