import { Character } from "@/types/5e2024/character";
import ClassesSection from "./classes-section";
import { useCharacterInfo, useCharacter, characterActions } from '@/store/5e2024/character-store';
import BackgroundSection from "./background-section";

export default function BasicInfo() {
  const characterInfo = useCharacterInfo();
  const { dispatch } = useCharacter();

  // Action handlers
  const onUpdate = (field: keyof Character['info'], value: string | number) => {
    dispatch(characterActions.updateBasicInfo(field, value));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Character Name</label>
          <input
            type="text"
            value={characterInfo.name}
            onChange={(e) => onUpdate('name', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Species</label>
          <input
            type="text"
            value={characterInfo.species}
            onChange={(e) => onUpdate('species', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Proficiency Bonus</label>
          <input
            type="number"
            value={characterInfo.proficiencyBonus}
            onChange={(e) => onUpdate('proficiencyBonus', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Alignment</label>
          <select
            value={characterInfo.alignment}
            onChange={(e) => onUpdate('alignment', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Alignment</option>
            <option value="Lawful Good">Lawful Good</option>
            <option value="Neutral Good">Neutral Good</option>
            <option value="Chaotic Good">Chaotic Good</option>
            <option value="Lawful Neutral">Lawful Neutral</option>
            <option value="True Neutral">True Neutral</option>
            <option value="Chaotic Neutral">Chaotic Neutral</option>
            <option value="Lawful Evil">Lawful Evil</option>
            <option value="Neutral Evil">Neutral Evil</option>
            <option value="Chaotic Evil">Chaotic Evil</option>
          </select>
        </div>
        
        <BackgroundSection />

        <ClassesSection />

      </div>
    </div>
  );
}
