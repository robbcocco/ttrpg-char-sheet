import { useCharacter } from "@/store/5e2024/character-store";
import { CharacterFeats } from "@/types/5e2024/character";
import { CharacterClassFeature, ICharacterClassFeature, loadClassFeatures, parseClassFeature } from "@/types/5e2024/character-class";
import { CharacterSubclass, CharacterSubclassFeature, ICharacterSubclassFeature, loadSubclassesFeatures, parseSubclassFeature } from "@/types/5e2024/character-subclass";
import { useEffect, useState } from "react";

export default function FeatsSection() {
    const { character } = useCharacter();
    const [classFeatures, setClassFeatures] = useState<ICharacterClassFeature[]>([]);
    const [subclassFeatures, setSubclassFeatures] = useState<ICharacterSubclassFeature[]>([]);

    useEffect(() => {
        loadClassFeatures(character.classes.map(characterClass => characterClass.name)).then(setClassFeatures);
        loadSubclassesFeatures(character.classes.filter(cc => cc.subclass).map(cc => cc.subclass) as CharacterSubclass[]).then(setSubclassFeatures);
    }, [character.classes]);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Feats</h2>

            <div className="space-y-1">
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
                                <span className="text-sm">{feat.name}, {feat.description}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
