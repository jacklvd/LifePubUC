'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'

const fetchMakerItems = async (): Promise<Item[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    {
      _id: 'm1',
      title: 'Handcrafted Ceramic Lantern',
      description:
        'Beautiful ceramic lantern handmade with eco-friendly materials. Perfect for indoor and outdoor use.',
      images: ['https://picsum.photos/id/119/800/800'],
      price: { amount: 75.0 },
      condition: 'new',
      category: 'furniture',
      views: 0,
      status: 'available',
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: 'm2',
      title: 'Hand-Painted Wooden Serving Board',
      description:
        'Unique, hand-painted serving board made from sustainable walnut wood. Food-safe finishes used.',
      images: ['https://picsum.photos/id/30/800/800'],
      price: { amount: 65.5 },
      condition: 'like_new',
      category: 'furniture',
      views: 0,
      status: 'available',
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: 'm3',
      title: 'Indigo Hand-Dyed Silk Scarf',
      description:
        'Luxurious silk scarf hand-dyed with natural indigo. Each piece is unique and one-of-a-kind.',
      images: ['https://picsum.photos/id/20/800/800'],
      price: { amount: 48.99 },
      condition: 'new',
      category: 'clothing',
      views: 0,
      status: 'available',
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: 'm4',
      title: 'Handcrafted Walnut Cutting Board',
      description:
        'Premium cutting board handcrafted from solid walnut. Finished with food-safe oils for durability.',
      images: ['https://picsum.photos/id/49/800/800'],
      price: { amount: 79.99 },
      condition: 'new',
      category: 'furniture',
      views: 0,
      status: 'available',
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: 'm5',
      title: 'Handwoven Cotton Drawstring Bag',
      description:
        'Eco-friendly handwoven cotton drawstring bag. Perfect for storage or as a gift bag.',
      images: ['https://picsum.photos/id/111/800/800'],
      price: { amount: 32.5 },
      condition: 'new',
      category: 'other',
      status: 'available',
      views: 0,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: 'm6',
      title: 'Leather Minimalist Wallet',
      description:
        'Handcrafted minimalist wallet made from premium full-grain leather. Will develop a beautiful patina over time.',
      images: ['https://picsum.photos/id/21/800/800'],
      price: { amount: 45.0 },
      condition: 'new',
      category: 'clothing',
      views: 0,
      status: 'available',
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]
}

const ShopMakerCommunities = () => {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    const loadMakerItems = async () => {
      try {
        setLoading(true)
        const data = await fetchMakerItems()
        setItems(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching maker items:', err)
        setError(
          'Failed to load maker communities items. Please try again later.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadMakerItems()
  }, [])

  const handleAddToCart = (e: React.MouseEvent, item: Item) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({ ...item })
  }

  return (
    <div className="max-w-10xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-sm text-gray-600 mb-2">Editors&apos; Picks</p>
        <h2 className="text-2xl md:text-3xl font-semibold mb-3">
          Shop Maker Communities
        </h2>
        <p className="text-gray-600 mb-6 max-w-xl">
          Discover artisan shops from our Uplift Makers Program, which aims to
          bring economic opportunities to creative entrepreneurs everywhere.
        </p>
        <Link href="/category?maker=true">
          <Button
            variant="outline"
            className="bg-gray-100 hover:bg-gray-200 hover:shadow-xl transition-all text-gray-900 rounded-full px-6"
          >
            Shop these unique finds
          </Button>
        </Link>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Link
              href={`/item/${item._id}`}
              key={item._id}
              className="group relative"
              onMouseEnter={() => setHoveredItem(item._id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="relative w-full aspect-square overflow-hidden rounded-md">
                <Image
                  src={item.images[0]}
                  alt={item.title}
                  width={700}
                  height={700}
                  //   sizes="(max-width: 768px) 70vw, (max-width: 1200px) 33vw, 16vw"
                  className={`object-cover transition-transform duration-500 ${
                    hoveredItem === item._id ? 'scale-105' : 'scale-100'
                  }`}
                />

                {/* Hover Actions */}
                <div
                  className={`absolute inset-0 bg-black bg-opacity-20 flex flex-col items-center justify-center transition-opacity duration-300 ${
                    hoveredItem === item._id ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="absolute border border-white bg-white-100 bottom-2 left-2 bg-white px-2 py-1 rounded-full text-sm font-semibold">
                    ${item.price.amount.toFixed(2)}
                  </div>
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => handleAddToCart(e, item)}
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-gray-100"
                    >
                      <ShoppingBag className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default ShopMakerCommunities
