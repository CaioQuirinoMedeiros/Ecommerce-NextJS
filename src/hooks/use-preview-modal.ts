import { Product } from '@/types'
import { create } from 'zustand'

interface PreviewModelData {
  isOpen: boolean
  product?: Product
  onOpen(product: Product): void
  onClose(): void
}

export const usePreviewModal = create<PreviewModelData>((set) => ({
  isOpen: false,
  product: undefined,
  onOpen: (product) => set({ product: product, isOpen: true }),
  onClose: () => set({ isOpen: false })
}))
