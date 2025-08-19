import { CharacterBackground } from "./character-background";
import { CharacterClass } from "./character-class";

export class CharacterInfo {
    constructor() {
        this.name = '';
        this.classes = [];
        this.proficiencyBonus = 2; // Default proficiency bonus for level 1-4 characters
        this.species = '';
        this.background = undefined;
        this.alignment = '';
        this.experiencePoints = 0;
    }

    name: string;
    classes: CharacterClass[];
    proficiencyBonus: number;
    species: string;
    background?: CharacterBackground;
    alignment: string;
    experiencePoints: number;
}
