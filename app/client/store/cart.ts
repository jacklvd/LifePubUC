import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem extends Item {
    quantity: number;
}
  
interface CartState {
    items: CartItem[];
    totalQuantity: number;
    totalAmount: number;
    addItem: (item: Item) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            totalAmount: 0,
            totalQuantity: 0,
            addItem: (item: Item) => {
                const current = get();
                const itemIndex = current.items.findIndex(i => i?._id === item?._id)
                
                if (itemIndex !== -1) {
                    const updatedItem = [...current.items];
                    updatedItem[itemIndex] = {
                        ...updatedItem[itemIndex],
                        quantity: (updatedItem[itemIndex].quantity || 1) + 1
                    }
                    
                    set({
                        items: updatedItem,
                        totalQuantity: current.totalQuantity + 1,
                        totalAmount: current.totalAmount + item.price.amount
                    })
                }
                else {
                    set({
                        items: [...current.items, { ...item, quantity: 1 }],
                        totalQuantity: current.totalQuantity + 1,
                        totalAmount: current.totalAmount + item.price.amount
                    })
                }
            },
            clearCart: () => {
                set({
                    items: [],
                    totalQuantity: 0,
                    totalAmount: 0,
                })
            }
        }),
        {
            name: 'cart-storage', 
        }
    )
)