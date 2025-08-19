import { Character } from "@/types/5e2024/character";
import { CharacterItem, ICharacterArmor, ICharacterWeapon } from "@/types/5e2024/character-equip";
import { useEffect, useState } from "react";

interface EquipSectionProps {
    character: Character;
    onUpdateWeapon: (item: ICharacterWeapon) => void;
    onUpdateArmor: (item: ICharacterArmor) => void;
}

export default function EquipSection({ character, onUpdateWeapon, onUpdateArmor }: EquipSectionProps) {
    const [availableWeapons, setAvailableWeapons] = useState<ICharacterWeapon[]>([]);
    const [availableArmors, setAvailableArmors] = useState<ICharacterArmor[]>([]);

    useEffect(() => {
        setAvailableWeapons(CharacterItem.loadWeapons());
        setAvailableArmors(CharacterItem.loadArmors());
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Equip</h2>

            {/* Add Weapon */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Weapon</label>
                <select
                    value={`${character.equip?.weapon ? `${JSON.stringify({ backgroundName: character.equip.weapon.name, backgroundSource: character.equip.weapon.source })}` : ''}`}
                    onChange={(e) => {
                        const { backgroundName, backgroundSource } = JSON.parse(e.target.value);
                        const newBackground = availableWeapons.find(bg => bg.name == backgroundName && bg.source == backgroundSource);
                        if (newBackground) onUpdateWeapon(newBackground)
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select Weapon</option>
                    {availableWeapons.map(background => (
                        <option key={`${background.name}-${background.source}`} value={`${JSON.stringify({ backgroundName: background.name, backgroundSource: background.source })}`}>{`${background.name} (${background.source})`}</option>
                    ))}
                </select>
            </div>

            {/* Add Armor */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Armor</label>
                <select
                    value={`${character.equip?.armor ? `${JSON.stringify({ backgroundName: character.equip.armor.name, backgroundSource: character.equip.armor.source })}` : ''}`}
                    onChange={(e) => {
                        const { backgroundName, backgroundSource } = JSON.parse(e.target.value);
                        const newBackground = availableArmors.find(bg => bg.name == backgroundName && bg.source == backgroundSource);
                        if (newBackground) onUpdateArmor(newBackground)
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select Armor</option>
                    {availableArmors.map(background => (
                        <option key={`${background.name}-${background.source}`} value={`${JSON.stringify({ backgroundName: background.name, backgroundSource: background.source })}`}>{`${background.name} (${background.source})`}</option>
                    ))}
                </select>
            </div>

        </div>
    );
}
