import { totalmem } from 'os'
import { create } from 'zustand' 

// Define a CartItem that extends the base Item
interface CartItem extends Item {
    quantity: number;
  }
  
  interface CartState {
    // State
    items: CartItem[];
    totalQuantity: number;  // Total of all quantities
    totalAmount: number;  // Total price
  
    // Actions
    addItem: (item: Item) => void;
    // removeItem: (itemId: string) => void;
    // updateQuantity: (itemId: string, quantity: number) => void;
    // clearCart: () => void;
  }

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    totalAmount: 0,
    totalQuantity: 0,
    addItem: (item: Item) =>  {
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
       
    }
})

)