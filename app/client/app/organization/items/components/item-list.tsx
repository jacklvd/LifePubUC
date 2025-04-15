import React from 'react'
import ItemCard from './item-card'

interface ItemsListProps {
    items: Item[]
    selectionMode: boolean
    selectedItems: Set<string>
    onSelectItem: (itemId: string) => void
    onUpdateStatus: (itemId: string, status: 'available' | 'sold' | 'reserved') => void
    onDeleteItem: (itemId: string) => void
}

const ItemsList: React.FC<ItemsListProps> = ({
    items,
    selectionMode,
    selectedItems,
    onSelectItem,
    onUpdateStatus,
    onDeleteItem
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
                <ItemCard
                    key={item._id}
                    item={item}
                    selectionMode={selectionMode}
                    isSelected={selectedItems.has(item._id)}
                    onSelect={onSelectItem}
                    onUpdateStatus={onUpdateStatus}
                    onDelete={onDeleteItem}
                />
            ))}
        </div>
    )
}

export default ItemsList