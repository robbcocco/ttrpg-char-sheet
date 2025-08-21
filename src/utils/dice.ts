export type Dice = {
    number: number;
    faces: number;
    bonus?: number;
}

export type Roll = {
    score: number,
    bonus?: number
}

export const rollDices = (dices: (string | Dice)[]): { sum: number, rolls: Roll[] } => {
    let sum = 0;
    const rolls: Roll[] = [];
    for (const { faces, bonus } of reduceDices(dices)) {
        const score = Math.floor(Math.random() * faces + 1);
        rolls.push({ score, bonus });
        sum += bonus ? score + bonus : score;
    }
    return { sum, rolls };
}

export const reduceDices = (dices: (string | Dice)[]): { faces: number, bonus?: number }[] => {
    return dices.map(parseDice).flatMap(({ number, faces, bonus }) =>
        Array.from({ length: Math.max(0, number) }, () => ({ faces, bonus }))
    );
}

export const parseDice = (dice: string | Dice): Dice => {
    if (typeof (dice) == 'string') {
        if (dice.toLowerCase().indexOf('d') > 0) {
            return {
                number: Number(dice.toLowerCase().split('d')[0]),
                faces: Number(dice.toLowerCase().split('d')[1])
            }
        } else {
            return {
                number: 1,
                faces: 20
            }
        }
    } else {
        return dice;
    }
}