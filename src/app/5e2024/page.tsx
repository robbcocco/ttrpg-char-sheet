import CharacterSheet from '@/components/5e2024/character-sheet';
import { CharacterProvider } from '@/store/5e2024/character-store';

export default function D5e2024Page() {
  return (
    <CharacterProvider>
      <CharacterSheet />
    </CharacterProvider>
  );
}
