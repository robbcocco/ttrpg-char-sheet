import { characterActions, useCharacter, useCharacterEquip } from "@/store/5e2024/character-store";
import { ICharacterArmor, ICharacterWeapon, loadArmors, loadWeapons } from "@/types/5e2024/character-equip";
import { useEffect, useState } from "react";

export default function EquipSection() {
    const characterEquip = useCharacterEquip();
    const { dispatch } = useCharacter();
    const [availableWeapons, setAvailableWeapons] = useState<ICharacterWeapon[]>([]);
    const [availableArmors, setAvailableArmors] = useState<ICharacterArmor[]>([]);

    const onUpdateWeapon = (weaponData: ICharacterWeapon) => {
        dispatch(characterActions.updateCharacterWeapon(weaponData));
    };

    const onUpdateArmor = (armorData: ICharacterArmor) => {
        dispatch(characterActions.updateCharacterArmor(armorData));
    };

    useEffect(() => {
        setAvailableWeapons(loadWeapons());
        setAvailableArmors(loadArmors());
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Equip</h2>

            {/* Add Weapon */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Weapon</label>
                <select
                    value={`${characterEquip?.weapon ? `${JSON.stringify({ backgroundName: characterEquip.weapon.name, backgroundSource: characterEquip.weapon.source })}` : ''}`}
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
                    value={`${characterEquip?.armor ? `${JSON.stringify({ backgroundName: characterEquip.armor.name, backgroundSource: characterEquip.armor.source })}` : ''}`}
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
