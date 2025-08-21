import { Dice, rollDices } from "@/utils/dice";

interface DiceRollerProps {
  children: React.ReactNode;
  dices: (string | Dice)[]
}

export default function DiceRoller({
  children,
  dices
}: Readonly<DiceRollerProps>) {
  const roll = () => {
    const {sum, rolls} = rollDices(dices);
    for (const roll of rolls) {
      console.log(`Roll: ${roll.score} + ${roll.bonus}`);
    }
    console.log(`Sum: ${sum}`)
  }

  return (
    <div onClick={roll} className="cursor-pointer">
      {children}
    </div>
  );
}