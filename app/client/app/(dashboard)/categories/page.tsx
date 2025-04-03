'use client'

import React, { useState, useEffect } from 'react'
import { categories } from '@/constants/categories'
import { useCartStore } from '@/store/cart'
import CategoriesSection from './components/categories-section'
import ItemsGrid from './components/items-grid'
import Pagination from './components/pagination'
import Sidebar from './components/sidebar'
import SortAndFilterBar from './components/sort-and-filter-bar'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'

const CategoryPage = () => {
  const [items, setItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [sortOption, setSortOption] = useState<string>('recommended')
  const [showFilters, setShowFilters] = useState(true)
  const [availabilityFilters, setAvailabilityFilters] = useState({
    inStock: false,
    preOrder: false,
    limitedEdition: false,
  })
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [totalPages, setTotalPages] = useState(1)
  const [paginatedItems, setPaginatedItems] = useState<Item[]>([])

  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/items`,
        )
        const data = await response.json()

        setItems(data?.data || [])
        setFilteredItems(data?.data || [])
      } catch (error) {
        console.error('Error fetching items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  useEffect(() => {
    let result = [...items]

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((item) => item.category === selectedCategory)
    }

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query)),
      )
    }

    // Apply price range filter
    result = result.filter(
      (item) =>
        item.price.amount >= priceRange[0] &&
        item.price.amount <= priceRange[1],
    )

    // Apply availability filters
    // if (availabilityFilters.inStock) {
    //   result = result.filter(item => item.inStock)
    // }
    // if (availabilityFilters.preOrder) {
    //   result = result.filter(item => item.preOrder)
    // }
    // if (availabilityFilters.limitedEdition) {
    //   result = result.filter(item => item.limitedEdition)
    // }

    // Apply sorting
    if (sortOption === 'priceLowToHigh') {
      result.sort((a, b) => a.price.amount - b.price.amount)
    } else if (sortOption === 'priceHighToLow') {
      result.sort((a, b) => b.price.amount - a.price.amount)
    } else if (sortOption === 'newest') {
      result.sort(
        (a, b) =>
          new Date(b?.createdAt || '').getTime() -
          new Date(a?.createdAt || '').getTime(),
      )
    }

    setFilteredItems(result)
    // Reset to first page when filters change
    setCurrentPage(1)
    // Calculate total pages
    setTotalPages(Math.ceil(result.length / itemsPerPage))
  }, [
    items,
    selectedCategory,
    searchQuery,
    priceRange,
    sortOption,
    availabilityFilters,
    itemsPerPage,
  ])

  // Handle pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setPaginatedItems(filteredItems.slice(startIndex, endIndex))
  }, [filteredItems, currentPage, itemsPerPage])

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value)
  }

  const handleSortChange = (value: string) => {
    setSortOption(value)
  }

  // const handleAvailabilityChange = (key: number, checked) => {
  //   setAvailabilityFilters(prev => ({
  //     ...prev,
  //     [key]: checked
  //   }))
  // }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory(null)
    setPriceRange([0, 1000])
    setAvailabilityFilters({
      inStock: false,
      preOrder: false,
      limitedEdition: false,
    })
    setSortOption('recommended')
  }

  // console.log(items);
  // console.log("Paginated: ", paginatedItems);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Categories Section */}
      <CategoriesSection
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters */}
          <Sidebar
            show={showFilters}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
            // availabilityFilters={availabilityFilters}
            // onAvailabilityChange={handleAvailabilityChange}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />

          {/* Main Content - Items */}
          <div className="flex-1">
            {/* Sort and Filter Bar */}
            <SortAndFilterBar
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              selectedCategory={selectedCategory}
              onClearCategory={() => setSelectedCategory(null)}
              itemCount={filteredItems.length}
              sortOption={sortOption}
              onSortChange={handleSortChange}
            />

            {/* Item Display */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : 1 > 0 ? (
              <>
                <ItemsGrid
                  items={paginatedItems}
                  onAddToCart={addItem}
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  totalItems={filteredItems.length}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Icon
                  name="Search"
                  className="text-gray-400 mb-4"
                  width={400}
                />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No items found
                </h3>
                <p className="text-gray-500 max-w-md">
                  Try adjusting your search or filter criteria to find what
                  you&apos;re looking for.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryPage
