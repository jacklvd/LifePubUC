import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/icons'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'

const SortAndFilterBar = ({ 
  showFilters, 
  setShowFilters, 
  selectedCategory,
  onClearCategory,
  itemCount,
  sortOption,
  onSortChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div className="flex items-center gap-2">
        <Button
          className="md:hidden rounded-full"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Icon name="SlidersHorizontal" className="mr-2" size={16} />
          <span>Filters</span>
        </Button>
        
        {selectedCategory && (
          <Badge variant="secondary" className="px-3 py-1">
            {selectedCategory}
            <button 
              onClick={onClearCategory}
              className="ml-2"
            >
              <Icon name="X" size={12} />
            </button>
          </Badge>
        )}
        
        <span className="text-sm text-gray-500 hidden sm:inline-block">
          {itemCount} item{itemCount !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Select value={sortOption} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="newest">Newest Arrivals</SelectItem>
            <SelectItem value="popularity">Most Popular</SelectItem>
            <SelectItem value="priceLowToHigh">Price: Low to High</SelectItem>
            <SelectItem value="priceHighToLow">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default SortAndFilterBar