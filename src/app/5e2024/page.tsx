import CharacterSheet from '@/components/5e2024/character-sheet';
import { CharacterProvider } from '@/store/5e2024/character-store';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "5e Character Sheet",
  description: "A not so very strict Character Sheet for D&D 5e (2024)",
};

export default function Page() {
  return (
    <CharacterProvider>
      <CharacterSheet />
    </CharacterProvider>
  );
}
