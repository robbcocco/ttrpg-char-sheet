export type CharacterInfo = {
    name: string;
    proficiencyBonus: number;
    species: string;
    alignment: string;
}

export const initCharacterInfo = (info?: CharacterInfo) => { return {
    name: info?.name ?? '',
    proficiencyBonus: info?.proficiencyBonus ?? 2,
    species: info?.species ?? '',
    alignment: info?.alignment ?? '',
}}
