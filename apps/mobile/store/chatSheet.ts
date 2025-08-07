import { create } from 'zustand';

interface ChatSheetStore {
  open: boolean;
  toggle: () => void;
  openSheet: () => void;
}

export const useChatSheet = create<ChatSheetStore>((set) => ({
  open: false,
  toggle: () => set((state) => ({ open: !state.open })),
  openSheet: () => set({ open: true }),
}));
