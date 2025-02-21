//cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
  alt: string;
}

interface CartState {
  items: Product[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        // If product already exists, increase the quantity.
        existingItem.quantity += product.quantity;
      } else {
        state.items.push(product);
      }
    },
    increment: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (state.items[index]) {
        state.items[index].quantity++;
      }
    },
    decrement: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (state.items[index] && state.items[index].quantity > 1) {
        state.items[index].quantity--;
      }
    },
    // Optionally, you can add a removeItem action.
  },
});

export const { addItem, increment, decrement } = cartSlice.actions;
export default cartSlice.reducer;
