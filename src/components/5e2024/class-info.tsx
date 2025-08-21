import { characterActions, useCharacter } from "@/store/5e2024/character-store";
import { CharacterClass } from "@/types/5e2024/character-class";
import { ICharacterSubclass, loadSubclasses } from "@/types/5e2024/character-subclass";
import { useEffect, useState } from "react";

interface ClassInfoProps {
    characterClass: CharacterClass;
}

export default function ClassInfo({ characterClass }: ClassInfoProps) {
    const { dispatch } = useCharacter();
    const [availableSubclasses, setAvailableSubclasses] = useState<ICharacterSubclass[]>([]);

    const onUpdateClassLevel = (className: string, level: number) => {
        dispatch(characterActions.updateClassLevel(className, level));
    };

    const onUpdateClassSubclass = (className: string, subclass?: ICharacterSubclass) => {
        dispatch(characterActions.updateClassSubclass(className, subclass));
    };

    const onRemoveClass = (className: string) => {
        dispatch(characterActions.removeCharacterClass(className));
    };

    useEffect(() => {
        loadSubclasses(characterClass.name).then(setAvailableSubclasses);
    }, [characterClass.name]);

    return (
        <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm">{characterClass.name}</h4>
                <button
                    onClick={() => onRemoveClass(characterClass.name)}
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
                        value={`${characterClass.subclass ? `${JSON.stringify({ shortName: characterClass.subclass.shortName, source: characterClass.subclass.source, classSource: characterClass.subclass.classSource })}` : ''}`}
                        onChange={(e) => {
                            if (!e.target.value || e.target.value == '') {
                                onUpdateClassSubclass(characterClass.name);
                            } else {
                                const { shortName, source, classSource } = JSON.parse(e.target.value);
                                const subclass = availableSubclasses.find(s => s.shortName == shortName && s.source == source && s.classSource == classSource);
                                if (subclass) onUpdateClassSubclass(characterClass.name, subclass);
                            }
                        }}
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                    >
                        <option value="">Select subclass...</option>
                        {availableSubclasses
                            .map(sub => (
                                <option
                                    key={`${sub.shortName}-${sub.source}-${sub.classSource}`}
                                    value={`${JSON.stringify({ shortName: sub.shortName, source: sub.source, classSource: sub.classSource })}`}
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
