import { Product } from '@/types'
import { toast } from 'react-hot-toast'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface CartData {
  items: Product[]
  addItem(product: Product): void
  removeItem(productId: string): void
  removeAll(): void
}

export const useCart = create(
  persist<CartData>(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const currentItems = get().items
        const existingItemId = currentItems.findIndex((item) => {
          return item.id === product.id
        })

        if (existingItemId !== -1) {
          toast.error('Item already in cart.')
        } else {
          set({ items: [...currentItems, product] })
          toast.success('Item added to cart.')
        }
      },
      removeItem: (productId) => {
        const currentItems = get().items
        set({
          items: currentItems.filter((item) => {
            return item.id !== productId
          })
        })
        toast.success('Item removed from the cart.')
      },
      removeAll: () => {
        set({ items: [] })
        toast.success('Items removed from the cart.')
      }
    }),
    { name: 'ecommerce:cart', storage: createJSONStorage(() => localStorage) }
  )
)
