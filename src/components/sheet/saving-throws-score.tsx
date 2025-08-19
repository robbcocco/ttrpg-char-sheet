import { CharacterAbilityScore } from "@/types/5e2024/character-ability-score";
import { formatModifier } from "@/utils/dice";

interface SavingThrowScoreProps {
    abilityScore: CharacterAbilityScore;
    onToggleProficiency: (key: string) => void;
}

export default function SavingThrowScore({ abilityScore, onToggleProficiency }: SavingThrowScoreProps) {
    const savingThrow = abilityScore.savingThrow()

    return (
        <div className="flex items-center justify-between">
            <input
                type="checkbox"
                checked={abilityScore.savingThrowProficient}
                onChange={() => onToggleProficiency(abilityScore.key)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex items-center space-x-2">
                <span className="text-sm capitalize">{abilityScore.name}</span>
            </div>
            <span className="font-medium">{formatModifier(savingThrow)}</span>
        </div>
    );
}
