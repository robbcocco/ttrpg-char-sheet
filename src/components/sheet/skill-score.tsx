import { CharacterSkill } from "@/types/5e2024/character-skill";
import { formatModifier } from "@/utils/dice";

interface SkillScoreProps {
  skill: CharacterSkill;
  onToggleProficiency: (skillName: string) => void;
}

export default function SkillScore({ skill, onToggleProficiency }: SkillScoreProps) {
  const modifier = skill.score();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={skill.proficient}
          onChange={() => onToggleProficiency(skill.name)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm">{skill.name}</span>
        <span className="text-xs text-gray-500">({skill.ability.slice(0, 3)})</span>
      </div>
      <span className="font-medium">{formatModifier(modifier)}</span>
    </div>
  );
}
