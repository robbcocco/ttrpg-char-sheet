import { CharacterAbilityScore, AbilityKey } from "@/types/5e2024/character-ability-score";
import { CharacterSkill } from "@/types/5e2024/character-skill";
import { formatModifier } from "@/utils/dice";

interface AbilitySectionProps {
  abilityScore: CharacterAbilityScore;
  skills: CharacterSkill[];
  onUpdateAbility: (abilityKey: AbilityKey, value: number) => void;
  onToggleSavingThrow: (abilityKey: string) => void;
  onToggleSkillProficiency: (skillName: string) => void;
}

export default function AbilitySection({ 
  abilityScore, 
  skills, 
  onUpdateAbility, 
  onToggleSavingThrow, 
  onToggleSkillProficiency 
}: AbilitySectionProps) {
  const handleAbilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 10;
    onUpdateAbility(abilityScore.key, value);
  };

  // Filter skills that belong to this ability
  const abilitySkills = skills.filter(skill => skill.ability === abilityScore.key);

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white">
      {/* Ability Score Header */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 capitalize mb-2">
          {abilityScore.name}
        </h3>
        
        {/* Ability Score Input */}
        <div className="flex items-center justify-center space-x-4 mb-2">
          <input
            type="number"
            min="1"
            max="30"
            value={abilityScore.value || 10}
            onChange={handleAbilityChange}
            className="w-16 text-center text-xl font-bold border-2 border-gray-300 rounded-md py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-center">
            <div className="text-xs text-gray-500">Modifier</div>
            <div className="text-lg font-bold">
              {formatModifier(abilityScore.modifier())}
            </div>
          </div>
        </div>
      </div>

      {/* Saving Throw */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Saving Throw</h4>
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={abilityScore.savingThrowProficient}
              onChange={() => onToggleSavingThrow(abilityScore.key)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm capitalize">{abilityScore.name}</span>
          </div>
          <span className="font-medium">{formatModifier(abilityScore.savingThrow())}</span>
        </div>
      </div>

      {/* Skills */}
      {abilitySkills.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
          <div className="space-y-1">
            {abilitySkills.map((skill) => (
              <div key={skill.name} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={skill.proficient}
                    onChange={() => onToggleSkillProficiency(skill.name)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{skill.name}</span>
                </div>
                <span className="font-medium">{formatModifier(skill.score())}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
