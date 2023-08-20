import { create } from 'zustand'

interface StoreModalState {
  isOpen: boolean
  onOpen(): void
  onClose(): void
}

export const useStoreModalStore = create<StoreModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}))
