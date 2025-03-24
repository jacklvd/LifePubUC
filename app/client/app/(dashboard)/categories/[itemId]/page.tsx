'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import StarRating from '@/components/star-rating'
import ItemsGrid from '../components/items-grid'
import { getItemById } from '@/lib/actions/item-actions'

const ItemDetailPage = () => {
  const router = useRouter()
  const { itemId }: { itemId: string } = useParams()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const [quantity, setQuantity] = useState(1)
  const [relatedItems, setRelatedItems] = useState<Item[]>([])
  const [activeTab, setActiveTab] = useState<string>('description')
  
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true)
      try {
        const response = await getItemById({ itemId })
        console.log('Item data:', response)
        const { data } = response

        setItem(data)
        
        // Handle images according to schema (images are strings, not objects)
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0])
        }

        // TODO: Implement when related API is ready
        // const relatedResponse = await fetch(`/api/items?category=${data.category}&limit=4`);
        // const relatedData = await relatedResponse.json();
        // setRelatedItems(relatedData.filter(item => item._id !== itemId).slice(0, 4));
      } catch (error) {
        console.error('Error fetching item details:', error)
        setItem(null)
      } finally {
        setLoading(false)
      }
    }
    
    if (itemId) {
      fetchItemDetails()
    }
  }, [itemId])

  const handleAddToCart = () => {
    if (item) {
      addItem({ ...item })
    }
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/checkout')
  }

  const handleImageSelect = (url: string, index: number) => {
    setSelectedImage(url)
    setSelectedImageIndex(index)
  }

  const handlePrevImage = () => {
    if (item && item.images.length > 0) {
      const newIndex = (selectedImageIndex - 1 + item.images.length) % item.images.length
      setSelectedImageIndex(newIndex)
      setSelectedImage(item.images[newIndex])
    }
  }

  const handleNextImage = () => {
    if (item && item.images.length > 0) {
      const newIndex = (selectedImageIndex + 1) % item.images.length
      setSelectedImageIndex(newIndex)
      setSelectedImage(item.images[newIndex])
    }
  }

  // Format condition for display
  const formatCondition = (condition: string) => {
    switch(condition) {
      case 'new': return 'New'
      case 'like_new': return 'Like New'
      case 'good': return 'Good'
      case 'fair': return 'Fair'
      case 'poor': return 'Poor'
      default: return condition
    }
  }

  // Format category for display
  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <span className="text-red-500 mb-4">⚠️</span>
        <h2 className="text-2xl font-bold mb-2">Item Not Found</h2>
        <p className="text-gray-600 mb-4">
          The item you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button onClick={() => router.push('/category')}>Return to Shop</Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link
                  href="/category"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Shop
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link
                  href={`/category?category=${item.category}`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {formatCategory(item.category)}
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500 truncate max-w-[200px]">
                  {item.title}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative h-96 md:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt={item?.title}
                fill
                className="object-contain"
              />
            )}

            {/* Navigation arrows (only show if multiple images) */}
            {item.images.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md opacity-70 hover:opacity-100"
                  onClick={handlePrevImage}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md opacity-70 hover:opacity-100"
                  onClick={handleNextImage}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {item.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {item.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative w-20 h-20 cursor-pointer border-2 rounded-md overflow-hidden ${
                    selectedImage === image
                      ? 'border-orange-500'
                      : 'border-transparent'
                  }`}
                  onClick={() => handleImageSelect(image, index)}
                >
                  <Image
                    src={image}
                    alt={`${item.title} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Item Info */}
        <div className="space-y-6">
          {/* Title and Badges */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              {item.featured && (
                <Badge className="bg-orange-100 text-orange-700 border-none text-xs py-0.5">
                  Featured
                </Badge>
              )}
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs py-0">
                {formatCondition(item.condition)}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs py-0">
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Badge>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold">
              {item.title}
            </h1>

            {/* Seller info (when populated) */}
            {/* {item.sellerInfo && (
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <span>Sold by </span>
                <a href="#" className="hover:underline ml-1 font-medium text-teal-700">
                  {item.sellerInfo.fullName || item.sellerInfo.username}
                </a>
              </div>
            )} */}

            {/* Views */}
            <div className="mt-1 text-sm text-gray-500">
              <span>{item.views} views</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline">
            <span className="text-2xl md:text-3xl font-bold">${item.price.amount.toFixed(2)}</span>
          </div>

          {/* Quick Details */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500 mt-0.5"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <div>
                <p className="font-medium text-sm">Condition</p>
                <p className="text-sm text-gray-600">{formatCondition(item.condition)}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500 mt-0.5"
              >
                <path d="M20 7h-9"></path>
                <path d="M14 17H5"></path>
                <circle cx="17" cy="17" r="3"></circle>
                <circle cx="7" cy="7" r="3"></circle>
              </svg>
              <div>
                <p className="font-medium text-sm">Category</p>
                <p className="text-sm text-gray-600">{formatCategory(item.category)}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500 mt-0.5"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
              </svg>
              <div>
                <p className="font-medium text-sm">Status</p>
                <p className="text-sm text-gray-600">{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</p>
              </div>
            </div>
            {item.rating && item.rating > 0 && (
              <div className="flex items-start space-x-2">
                <div className="mt-0.5">
                  <StarRating rating={item.rating} size="sm" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {item.rating.toFixed(1)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Purchase Options */}
          <div className="space-y-4 border-t border-b py-4">
            {/* Quantity Selector */}
            <div className="flex items-center">
              <span className="text-sm font-medium w-20">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <button
                  className="px-3 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1 border-x text-center w-12">
                  {quantity}
                </span>
                <button
                  className="px-3 py-1 text-gray-500 hover:bg-gray-100"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Buy Buttons */}
          <div className="flex space-x-4">
            <Button
              variant="default"
              size="lg"
              className="flex-1 bg-black hover:bg-gray-800"
              onClick={handleBuyNow}
              disabled={item.status !== 'available'}
            >
              {item.status === 'available' ? 'Buy Now' : 'Not Available'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 border-black text-black hover:bg-gray-100"
              onClick={handleAddToCart}
              disabled={item.status !== 'available'}
            >
              Add to Cart
            </Button>
          </div>

          {/* Save / Share */}
          <div className="flex mt-4 text-sm">
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              Save to Favorites
            </button>
            <button className="flex items-center text-gray-600 hover:text-gray-900 ml-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              Share
            </button>
          </div>

          {/* Shop promises */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 text-sm text-gray-600">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-teal-600"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>Secure transactions</span>
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-teal-600"
              >
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              <span>Fast shipping</span>
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-teal-600"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Returns accepted within 30 days</span>
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-teal-600"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>24/7 customer support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs section */}
      <div className="mb-16">
        <Tabs
          defaultValue="description"
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6 border-b w-full justify-start rounded-none bg-transparent space-x-8">
            <TabsTrigger
              value="description"
              className={`pb-2 text-base font-medium ${
                activeTab === 'description'
                  ? 'border-b-2 border-black rounded-none'
                  : 'text-gray-500'
              }`}
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className={`pb-2 text-base font-medium ${
                activeTab === 'details'
                  ? 'border-b-2 border-black rounded-none'
                  : 'text-gray-500'
              }`}
            >
              Item Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <p>{item.description}</p>
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Item Details</h3>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="font-medium w-32">Condition:</span>
                    <span>{formatCondition(item.condition)}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32">Category:</span>
                    <span>{formatCategory(item.category)}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32">Status:</span>
                    <span>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32">Featured:</span>
                    <span>{item.featured ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32">Listed on:</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              {/* {item.sellerInfo && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Seller Information</h3>
                  <div className="flex items-start space-x-4">
                    {item.sellerInfo.avatar && (
                      <div className="relative w-12 h-12 overflow-hidden rounded-full">
                        <Image
                          src={item.sellerInfo.avatar}
                          alt={item.sellerInfo.username || 'Seller'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium">{item.sellerInfo.fullName || item.sellerInfo.username}</h4>
                      {item.sellerInfo.email && (
                        <p className="text-sm text-gray-600 mt-1">
                          Contact: {item.sellerInfo.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )} */}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Items */}
      {relatedItems.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          <ItemsGrid
            items={relatedItems}
            onAddToCart={addItem}
            onItemSelect={(itemId: string) => router.push(`/item/${itemId}`)}
          />
        </div>
      )}
    </div>
  )
}

export default ItemDetailPage