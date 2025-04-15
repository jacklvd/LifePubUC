import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckSquare } from 'lucide-react'

interface FiltersToolbarProps {
  statusFilter: string
  searchQuery: string
  sortBy: string
  selectionMode: boolean
  selectedCount: number
  onStatusFilterChange: (status: string) => void
  onSearchQueryChange: (query: string) => void
  onSearchSubmit: (e: React.FormEvent) => void
  onSortByChange: (sort: string) => void
  onToggleSelectionMode: () => void
  onSelectAll: () => void
  allSelected: boolean
}

export const FiltersToolbar: React.FC<FiltersToolbarProps> = ({
  statusFilter,
  searchQuery,
  sortBy,
  selectionMode,
  selectedCount,
  onStatusFilterChange,
  onSearchQueryChange,
  onSearchSubmit,
  onSortByChange,
  onToggleSelectionMode,
  onSelectAll,
  allSelected,
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-4">
          {/* Status filter buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={statusFilter === 'all' ? 'secondary' : 'outline'}
              onClick={() => onStatusFilterChange('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'available' ? 'secondary' : 'outline'}
              onClick={() => onStatusFilterChange('available')}
              size="sm"
            >
              Active
            </Button>
            <Button
              variant={statusFilter === 'sold' ? 'secondary' : 'outline'}
              onClick={() => onStatusFilterChange('sold')}
              size="sm"
            >
              Sold
            </Button>
            <Button
              variant={statusFilter === 'reserved' ? 'secondary' : 'outline'}
              onClick={() => onStatusFilterChange('reserved')}
              size="sm"
            >
              Reserved
            </Button>
          </div>

          {/* Search form */}
          <form onSubmit={onSearchSubmit} className="flex w-full md:w-auto">
            <Input
              type="text"
              placeholder="Search your listings"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="rounded-r-none w-full md:w-64"
            />
            <Button type="submit" className="rounded-l-none">
              Search
            </Button>
          </form>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          {/* Selection controls */}
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <Button
              variant={selectionMode ? 'secondary' : 'outline'}
              onClick={onToggleSelectionMode}
              size="sm"
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              {selectionMode ? 'Cancel' : 'Select'}
            </Button>

            {selectionMode && (
              <>
                <Button variant="outline" onClick={onSelectAll} size="sm">
                  {allSelected ? 'Deselect all' : 'Select all'}
                </Button>
                <div className="text-sm text-gray-600 ml-2">
                  {selectedCount} selected
                </div>
              </>
            )}
          </div>

          {/* Sort controls */}
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Sort by:</span>
            <Select value={sortBy} onValueChange={onSortByChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-createdAt">Newest</SelectItem>
                <SelectItem value="createdAt">Oldest</SelectItem>
                <SelectItem value="-views">Most views</SelectItem>
                <SelectItem value="price.amount">Price: Low to high</SelectItem>
                <SelectItem value="-price.amount">
                  Price: High to low
                </SelectItem>
                <SelectItem value="title">Title: A-Z</SelectItem>
                <SelectItem value="-title">Title: Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FiltersToolbar
