import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem extends Item {
  quantity: number
}

interface CartState {
  items: CartItem[]
  totalQuantity: number
  totalAmount: number
  addItem: (item: Item) => void
  clearCart: () => void
  removeItem: (id: string) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalAmount: 0,
      totalQuantity: 0,
      addItem: (item: Item) => {
        const current = get()
        const itemIndex = current.items.findIndex((i) => i?._id === item?._id)

        if (itemIndex !== -1) {
          const updatedItem = [...current.items]
          updatedItem[itemIndex] = {
            ...updatedItem[itemIndex],
            quantity: (updatedItem[itemIndex].quantity || 1) + 1,
          }

          set({
            items: updatedItem,
            totalQuantity: current.totalQuantity + 1,
            totalAmount: current.totalAmount + item.price.amount,
          })
        } else {
          set({
            items: [...current.items, { ...item, quantity: 1 }],
            totalQuantity: current.totalQuantity + 1,
            totalAmount: current.totalAmount + item.price.amount,
          })
        }
      },
      clearCart: () => {
        set({
          items: [],
          totalQuantity: 0,
          totalAmount: 0,
        })
      },
      /* Remove item */
      removeItem: (id) => {
        const current = get()
        const itemToRemove = current.items.find((item) => item._id === id)
        console.log('Here')
        // not found
        if (!itemToRemove) return

        // calculate quantity and amount
        const quantityToRemove = itemToRemove.quantity
        const amountToRemove = itemToRemove.price.amount * quantityToRemove

        set({
          items: current.items.filter((item) => item._id !== id),
          totalQuantity: current.totalQuantity - quantityToRemove,
          totalAmount: current.totalAmount - amountToRemove,
        })
      },
    }),

    {
      name: 'cart-storage',
    },
  ),
)
