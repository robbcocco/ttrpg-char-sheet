import ClassInfo from "./class-info";
import { ICharacterClass, loadClasses } from "@/types/5e2024/character-class";
import { useEffect, useState } from "react";
import { characterActions, useCharacter, useCharacterClasses } from "@/store/5e2024/character-store";

export default function ClassesSection() {
    const characterClasses = useCharacterClasses();
    const { dispatch } = useCharacter();
    const [availableClasses, setAvailableClasses] = useState<ICharacterClass[]>([]);

    const onAddClass = (classData: ICharacterClass) => {
        dispatch(characterActions.addCharacterClass(classData));
    };

    useEffect(() => {
        loadClasses().then(setAvailableClasses);
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
                {characterClasses.map((characterClass, index) => (
                    <ClassInfo
                        key={index}
                        characterClass={characterClass}
                    />
                ))}
            </div>
        </div>
    );
}
