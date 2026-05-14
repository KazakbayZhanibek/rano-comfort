import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id:       number
  name:     string
  price:    number
  volume?:  string
  image?:   string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem:    (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  updateQty:  (id: number, quantity: number) => void
  clearCart:  () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem(item) {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: 1 }] }
        })
      },

      removeItem(id) {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
      },

      updateQty(id, quantity) {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart() {
        set({ items: [] })
      },

      totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },

      totalPrice() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },
    }),
    { name: 'rano-cart' }   // сохраняется в localStorage
  )
)