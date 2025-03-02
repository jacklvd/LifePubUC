'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent,  CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import { Check, ChevronLeft, CreditCard, ShoppingCart, Trash } from 'lucide-react'
import Link from 'next/link'

const CheckoutPage = () => {
  const { items, totalAmount, totalQuantity, clearCart, removeItem } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: 'Your cart is empty',
        description: 'Add some items to your cart before checkout',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      const lineItems = items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            description: item.description,
            images: item.images,
          },
          unit_amount: Math.round(item.price.amount * 100), // Stripe requires amounts in cents
        },
        quantity: item.quantity,
      }))

      // Send the checkout request to our API route
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          lineItems,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Redirect to Stripe Checkout
      router.push(data.url)
      
    } catch (error) {
      console.error('Error during checkout:', error)
      toast({
        title: 'Checkout failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/categories" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Continue Shopping
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Summary */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Cart Summary
                <span className="text-sm font-normal text-gray-500">
                  ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Link href="/categories">
                    <Button variant="outline">Browse Items</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item._id} className="flex items-center gap-4 pb-4 border-b">
                      <div className="relative w-16 h-16 overflow-hidden rounded">
                        <Image
                          src={item.images[0] || '/placeholder-image.jpg'}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-500">
                          {item.condition.replace('_', ' ').toUpperCase()}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <span>
                            {formatPrice(item.price.amount)} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            {formatPrice(item.price.amount * item.quantity)}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeItem(item._id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex justify-end">
                    <Button variant="ghost" className="text-red-500" 
                    onClick={() => clearCart()}
                    
                    >
                      Clear Cart
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(totalAmount * 0.1)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(totalAmount * 1.1)}</span>
              </div>

              <Button
                className="w-full mt-4"
                size="lg"
                disabled={items.length === 0 || isLoading}
                onClick={handleCheckout}
              >
                {isLoading ? (
                  <div className="flex items-center gap-1">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Pay with Stripe</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage