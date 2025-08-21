import { useEffect, useState } from "react";
import { ICharacterBackground, loadBackgrounds } from "@/types/5e2024/character-background";
import { useCharacter, characterActions, useCharacterBackground } from '@/store/5e2024/character-store';

export default function BackgroundSection() {
  const characterBackground = useCharacterBackground();
  const { dispatch } = useCharacter();
  const [availableBackgrounds, setAvailableBackgrounds] = useState<Partial<ICharacterBackground>[]>([]);

  const onUpdateBackground = (background?: Partial<ICharacterBackground>) => {
    dispatch(characterActions.updateCharacterBackground(background));
  };

  useEffect(() => {
    setAvailableBackgrounds(loadBackgrounds());
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Background</label>
      <select
        value={`${characterBackground ? `${JSON.stringify({ backgroundName: characterBackground.name, backgroundSource: characterBackground.source })}` : ''}`}
        onChange={(e) => {
          if (!e.target.value || e.target.value == '') {
            onUpdateBackground();
          } else {
            const { backgroundName, backgroundSource } = JSON.parse(e.target.value);
            const newBackground = availableBackgrounds.find(bg => bg.name == backgroundName && bg.source == backgroundSource);
            if (newBackground) onUpdateBackground(newBackground);
          }
        }}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Background</option>
        {availableBackgrounds.map(background => (
          <option key={`${background.name}-${background.source}`} value={`${JSON.stringify({ backgroundName: background.name, backgroundSource: background.source })}`}>{`${background.name} (${background.source})`}</option>
        ))}
      </select>
    </div>
  );
}
