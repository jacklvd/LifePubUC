import React, { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// Define the type for the props
interface SearchBarProps {
    searchQuery: string
    handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleSearchKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
    sortOption: string
    setSortOption: (option: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({
    searchQuery,
    handleSearch,
    handleSearchKeyDown,
    sortOption,
    setSortOption,
}) => {
    const [filterMenuOpen, setFilterMenuOpen] = useState(false)

    return (
        <div className="relative mb-8">
            <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search events, venues, or keywords..."
                        className="pl-10 pr-4 py-6 rounded-lg border-gray-300 focus:border-blue-500 w-full"
                        value={searchQuery}
                        onChange={handleSearch}
                        onKeyDown={handleSearchKeyDown}
                    />
                </div>
                <Button
                    className={`bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg p-3 relative ${filterMenuOpen ? 'bg-blue-100' : ''}`}
                    onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                >
                    <Filter className="h-5 w-5" />
                    {filterMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg p-4 z-30 w-64 border">
                            <h3 className="font-medium mb-3">Sort by</h3>
                            <div className="space-y-2">
                                {['newest', 'oldest', 'price-low', 'price-high'].map((option) => (
                                    <div
                                        key={option}
                                        className={`p-2 rounded cursor-pointer ${sortOption === option ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                                        onClick={() => {
                                            setSortOption(option)
                                            setFilterMenuOpen(false)
                                        }}
                                    >
                                        {option === 'newest' && 'Date (newest first)'}
                                        {option === 'oldest' && 'Date (oldest first)'}
                                        {option === 'price-low' && 'Price (low to high)'}
                                        {option === 'price-high' && 'Price (high to low)'}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Button>
            </div>
        </div>
    )
}

export default SearchBar