'use client'

import React from 'react'
import ItemCard from './item-card'
import { useCartStore } from '@/store/cart'

const ItemsGrid = ({ items, onItemSelect, onAddToCart }) => {
  const addItem = useCartStore((state) => state.addItem)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item: Item, index: number) => (
        <div
          key={index}
          className="transition-all duration-200 hover:scale-[1.02]"
        >
          <ItemCard item={item} addItem={addItem} />
        </div>
      ))}
    </div>
  )
}

export default ItemsGrid
