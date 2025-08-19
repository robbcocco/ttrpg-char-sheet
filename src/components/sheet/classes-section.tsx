import { Character } from "@/types/5e2024/character";
import ClassInfo from "./class-info";
import { CharacterClass, ICharacterClass, ICharacterSubclass } from "@/types/5e2024/character-class";
import { useEffect, useState } from "react";

interface ClassesSectionProps {
    character: Character;
    onAddClass: (classData: ICharacterClass) => void;
    onUpdateClassLevel: (className: string, level: number) => void;
    onUpdateClassSubclass: (className: string, subclass: ICharacterSubclass) => void;
    onRemoveClass: (classIndex: number) => void;
}

export default function ClassesSection({
    character,
    onAddClass,
    onUpdateClassLevel,
    onUpdateClassSubclass,
    onRemoveClass,
}: ClassesSectionProps) {
    const [availableClasses, setAvailableClasses] = useState<ICharacterClass[]>([]);

    useEffect(() => {
        CharacterClass.loadClasses().then(setAvailableClasses);
    }, []);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Classes</label>

            {/* Add Class */}
            <div className="mb-3">
                <select
                    onChange={(e) => {
                        if (e.target.value) {
                            const classData = availableClasses.find(c => c.name === e.target.value);
                            if (classData) {
                            onAddClass(classData)
                            }
                        }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    defaultValue=""
                >
                    <option value="">Add a class...</option>
                    {availableClasses.map(cls => (
                        <option key={`${cls.name}-${cls.source}`} value={cls.name}>{cls.name}</option>
                    ))}
                </select>
            </div>

            {/* Current Classes */}
            <div className="space-y-3">
                {character.info.classes.map((characterClass, index) => (
                    <ClassInfo
                        key={index}
                        characterClass={characterClass}
                        onUpdateClassLevel={onUpdateClassLevel}
                        onUpdateClassSubclass={onUpdateClassSubclass}
                        onRemoveClass={() => onRemoveClass(index)}
                    />
                ))}
            </div>
        </div>
    );
}
