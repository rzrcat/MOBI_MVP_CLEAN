import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Character } from '@/types/character';

interface CharacterStore {
  characters: Character[];
  selectedCharacterId: string | null;
  addCharacter: (character: Character) => void;
  updateCharacter: (id: string, settings: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  selectCharacter: (id: string) => void;
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => ({
      characters: [],
      selectedCharacterId: null,
      addCharacter: (character) =>
        set((state) => ({
          characters: [...state.characters, character],
          selectedCharacterId: character.id,
        })),
      updateCharacter: (id, settings) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? { ...c, ...settings } : c
          ),
        })),
      deleteCharacter: (id) =>
        set((state) => {
          const filtered = state.characters.filter((c) => c.id !== id);
          return {
            characters: filtered,
            selectedCharacterId:
              state.selectedCharacterId === id && filtered.length > 0
                ? filtered[0].id
                : filtered.length === 0
                  ? null
                  : state.selectedCharacterId,
          };
        }),
      selectCharacter: (id) => set({ selectedCharacterId: id }),
    }),
    {
      name: 'character-storage',
    }
  )
);
