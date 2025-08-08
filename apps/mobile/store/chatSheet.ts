import { create } from 'zustand';

interface ChatSheetStore {
  open: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
  openSheet: () => void;
  closeSheet: () => void;
}

export const useChatSheet = create<ChatSheetStore>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
  toggle: () => set((state) => ({ open: !state.open })),
  openSheet: () => set({ open: true }),
  closeSheet: () => set({ open: false }),
}));
