import { CharacterClass, ICharacterSubclass } from "@/types/5e2024/character-class";
import { useEffect, useState } from "react";

interface ClassInfoProps {
    characterClass: CharacterClass;
    onUpdateClassLevel: (className: string, level: number) => void;
    onUpdateClassSubclass: (className: string, subclass: ICharacterSubclass) => void;
    onRemoveClass: (index: number) => void
}

export default function ClassInfo({
    characterClass,
    onUpdateClassLevel,
    onUpdateClassSubclass,
    onRemoveClass
}: ClassInfoProps) {
    const [availableSubclasses, setAvailableSubclasses] = useState<ICharacterSubclass[]>([]);

    useEffect(() => {
        characterClass.loadSublasses().then(setAvailableSubclasses);
    }, [characterClass]);

    return (
        <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm">{characterClass.name}</h4>
                <button
                    onClick={() => onRemoveClass}
                    className="text-red-600 hover:text-red-800 text-xs"
                >
                    Remove
                </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-xs font-medium text-gray-700">Level</label>
                    <input
                        type="number"
                        min="1"
                        max="20"
                        value={characterClass.level}
                        onChange={(e) => onUpdateClassLevel(characterClass.name, parseInt(e.target.value) || 1)}
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Subclass</label>
                    <select
                        value={`${characterClass.subclass ? `${JSON.stringify({ subclassShortname: characterClass.subclass.shortname, subclassSource: characterClass.subclass.source, subclassClassSource: characterClass.subclass.classSource })}` : ''}`}
                        onChange={(e) => {
                            const { subclassShortname, subclassSource, subclassClassSource } = JSON.parse(e.target.value);
                            const subclass = availableSubclasses.find(s => s.shortName == subclassShortname && s.source == subclassSource && s.classSource == subclassClassSource);
                            if (subclass) onUpdateClassSubclass(characterClass.name, subclass);
                        }}
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                    >
                        <option value="">Select subclass...</option>
                        {availableSubclasses
                            .filter(sub => sub.className === characterClass.name)
                            .map(sub => (
                                <option
                                    key={`${sub.shortName}-${sub.source}-${sub.classSource}`}
                                    value={`${JSON.stringify({ subclassShortname: sub.shortName, subclassSource: sub.source, subclassClassSource: sub.classSource })}`}
                                >
                                    {`${sub.name} (${sub.source}) (${sub.classSource})`}
                                </option>
                            ))
                        }
                    </select>
                </div>
            </div>

            {characterClass.spellcastingAbility && (
                <div className="mt-2">
                    <span className="text-xs text-gray-600">
                        Spellcasting: {characterClass.spellcastingAbility.toUpperCase()}
                    </span>
                </div>
            )}
        </div>
    );
}
