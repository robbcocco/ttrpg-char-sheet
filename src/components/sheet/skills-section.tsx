import { Character } from "@/types/5e2024/character";
import SkillScore from "./skill-score";

interface SkillsSectionProps {
  character: Character;
  onToggleSkillProficiency: (skillName: string) => void;
}

export default function SkillsSection({ character, onToggleSkillProficiency }: SkillsSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Skills</h2>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {character.skills.map((skill) => (
          <SkillScore
            key={skill.name}
            skill={skill}
            onToggleProficiency={onToggleSkillProficiency}
          />
        ))}
      </div>
    </div>
  );
}
