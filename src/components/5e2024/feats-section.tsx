import { characterActions, useCharacter } from "@/store/5e2024/character-store";
import { CharacterFeats } from "@/types/5e2024/character";
import { CharacterClassFeature, ICharacterClassFeature, loadClassFeatures, parseClassFeature } from "@/types/5e2024/character-class";
import { ICharacterFeat, loadFeats } from "@/types/5e2024/character-feat";
import { CharacterSubclass, CharacterSubclassFeature, ICharacterSubclassFeature, loadSubclassesFeatures, parseSubclassFeature } from "@/types/5e2024/character-subclass";
import { useEffect, useState } from "react";

export default function FeatsSection() {
  const { character, dispatch } = useCharacter();
  const [characterFeatures, setCharacterFeatures] = useState<ICharacterFeat[]>([]);
  const [classFeatures, setClassFeatures] = useState<ICharacterClassFeature[]>([]);
  const [subclassFeatures, setSubclassFeatures] = useState<ICharacterSubclassFeature[]>([]);

  const onAddFeature = (featData: ICharacterFeat) => {
      dispatch(characterActions.addCharacterFeat(featData));
  };

  const onRemoveFeature = (index: number) => {
      dispatch(characterActions.removeCharacterFeat(index));
  };

  useEffect(() => {
    loadClassFeatures(character.classes.map(characterClass => characterClass.name)).then(setClassFeatures);
    loadSubclassesFeatures(character.classes.filter(cc => cc.subclass).map(cc => cc.subclass) as CharacterSubclass[]).then(setSubclassFeatures);
  }, [character.classes]);

  useEffect(() => {
    setCharacterFeatures(loadFeats());
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Feats</h2>

      {/* Add Character Feat */}
      <div className="mb-3">
        <select
          onChange={(e) => {
            if (e.target.value) {
              const featData = characterFeatures.find(f => f.name === e.target.value);
              if (featData) {
                onAddFeature(featData)
                e.target.value = '';
              }
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          defaultValue=""
        >
          <option value="">Add a feat...</option>
          {characterFeatures.map(feat => (
            <option key={`${feat.name}-${feat.source}`} value={feat.name}>{feat.name}</option>
          ))}
        </select>
      </div>

      {/* Character Feats */}
      {character.feats && character.feats.length > 0 && <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Character Feats</label>
        {character.feats.map((feat, index) => {
          return (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <div className="flex items-center space-x-2">
                <span className="text-sm">{feat.name}</span>
              </div>
              <button
                  onClick={() => onRemoveFeature(index)}
                  className="text-red-600 hover:text-red-800 text-xs"
              >
                  X
              </button>
            </div>
          )
        })}
      </div>}

      {/* Class Feats */}
      {CharacterFeats(character).length > 0 && <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Class Feats</label>
        {CharacterFeats(character).map((feature, index) => {
          let feat: CharacterClassFeature | CharacterSubclassFeature;
          if ('classSource' in feature) {
            feat = parseSubclassFeature(feature, subclassFeatures);
          } else {
            feat = parseClassFeature(feature, classFeatures);
          }
          return (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <div className="flex items-center space-x-2">
                <span className="text-sm">{feat.name}</span>
              </div>
            </div>
          )
        })}
      </div>}
    </div>
  );
}
