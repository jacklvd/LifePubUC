'use client'

import React from 'react'
import ItemCard from './item-card'
import { useCartStore } from '@/store/cart'

interface ItemGridProps {
  items: Item[],
  onAddToCart: (item: Item) => void
}


const ItemsGrid = ({ items, onAddToCart }: ItemGridProps) => {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item: Item, index: number) => (
        <div
          key={index}
          className="transition-all duration-200 hover:scale-[1.02]"
        >
          <ItemCard item={item} addItem={onAddToCart} />
        </div>
      ))}
    </div>
  )
}

export default ItemsGrid
