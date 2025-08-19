import { Character } from "@/types/5e2024/character";
import { ICharacterClass, ICharacterSubclass } from "@/types/5e2024/character-class";
import ClassesSection from "./classes-section";
import { useEffect, useState } from "react";
import { CharacterBackground, ICharacterBackground } from "@/types/5e2024/character-background";

interface BasicInfoProps {
  character: Character;
  onUpdate: (field: keyof Character['info'], value: string | number) => void;
  onUpdateBackground: (background: Partial<ICharacterBackground>) => void;
  onAddClass: (classData: ICharacterClass) => void;
  onUpdateClassLevel: (className: string, level: number) => void;
  onUpdateClassSubclass: (className: string, subclass: ICharacterSubclass) => void;
  onRemoveClass: (classIndex: number) => void;
}

export default function BasicInfo({
  character,
  onUpdate,
  onUpdateBackground,
  onAddClass,
  onUpdateClassLevel,
  onUpdateClassSubclass,
  onRemoveClass
}: BasicInfoProps) {
  const [availableBackgrounds, setAvailableBackgrounds] = useState<Partial<ICharacterBackground>[]>([]);

  useEffect(() => {
    setAvailableBackgrounds(CharacterBackground.loadBackgrounds());
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Character Name</label>
          <input
            type="text"
            value={character.info.name}
            onChange={(e) => onUpdate('name', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Species</label>
          <input
            type="text"
            value={character.info.species}
            onChange={(e) => onUpdate('species', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Proficiency Bonus</label>
          <input
            type="number"
            value={character.info.proficiencyBonus}
            onChange={(e) => onUpdate('proficiencyBonus', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Alignment</label>
          <select
            value={character.info.alignment}
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
        <div>
          <label className="block text-sm font-medium text-gray-700">Background</label>
          <select
            value={`${character.info.background ? `${JSON.stringify({ backgroundName: character.info.background.name, backgroundSource: character.info.background.source })}` : ''}`}
            onChange={(e) => {
              const { backgroundName, backgroundSource } = JSON.parse(e.target.value);
              const newBackground = availableBackgrounds.find(bg => bg.name == backgroundName && bg.source == backgroundSource);
              if (newBackground) onUpdateBackground(newBackground)
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Background</option>
            {availableBackgrounds.map(background => (
              <option key={`${background.name}-${background.source}`} value={`${JSON.stringify({ backgroundName: background.name, backgroundSource: background.source })}`}>{`${background.name} (${background.source})`}</option>
            ))}
          </select>
        </div>

        <ClassesSection
          character={character}
          onAddClass={onAddClass}
          onUpdateClassLevel={onUpdateClassLevel}
          onUpdateClassSubclass={onUpdateClassSubclass}
          onRemoveClass={onRemoveClass}
        />

      </div>
    </div>
  );
}
