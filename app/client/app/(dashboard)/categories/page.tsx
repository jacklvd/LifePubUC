'use client'

import React, { useState, useEffect } from 'react'
import { categories } from '@/constants/categories'
import CategoryCard from './components/category-card'
import ItemCard from './components/item-card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Settings2, ArrowUpDown, Plus } from 'lucide-react'

import { useCartStore } from '@/store/cart'

const CategoryPage = () => {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/items`,
        )
        const data = await response.json()
        console.log(data)
        setItems(data?.data)
      } catch (error) {
        console.error('Error fetching items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [selectedCategory])
  return (
    <div className="w-full min-h-100 flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col justify-center items-center gap-3 mt-8">
        <h1 className="text-4xl ">Categories</h1>
        <p className="text-gray-500">
          Book, clothing, ticket, souvenirs we have it all
        </p>
        {/* Card to category */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {categories.map((category, index) => (
            <Link key={index} href={`/categories/${category.title}`}>
              <CategoryCard category={category} />
            </Link>
          ))}
        </div>
        <Button
          className="rounded-full border hover:border-black hover:bg-gray-200 hover:border-3 transition-all"
          variant="outline"
        >
          <Plus />
          <p>More</p>
        </Button>
      </div>


      {/* Item List */}
      <div className="max-w-7xl mx-auto px-4">
        {items.length > 0 && (
          <div className="flex mx-auto w-full flex-row justify-between my-5">
            <div>
              <Button
                className="rounded-full border hover:border-black hover:border-3 transition-all"
                variant="outline"
              >
                <Settings2 />
                <p>All Filter</p>
              </Button>
            </div>
            <div className="flex flex-row ">
              {/* <p className='text-gray-500 text-md'>+20 items</p> */}
              <Button
                className="rounded-full border hover:border-black hover:border-3 transition-all"
                variant="outline"
              >
                <ArrowUpDown />
                <p>Sort</p>
              </Button>
            </div>
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {items.map((item, index) => (
              <ItemCard key={index} item={item} addItem={addItem} />
            ))}
          </div>
        )}
        {!loading && items.length === 0 && (
          <div className="text-center text-gray-500">
            No items found {selectedCategory && `in ${selectedCategory}`}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryPage
