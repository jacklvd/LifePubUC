'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import Link from 'next/link'
import StripeProvider from './components/stripe-provider'
import CheckoutForm from './components/checkout-form'

import { EmbeddedCheckout } from '@stripe/react-stripe-js'

const CheckoutPage = () => {
  const { items, totalAmount, totalQuantity, removeItem, clearCart } =
    useCartStore()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isPaymentComplete, setIsPaymentComplete] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const initiateCheckout = () => {
    setIsCheckingOut(true)
  }

  const handlePaymentSuccess = () => {
    setIsPaymentComplete(true)
    clearCart()

    toast({
      title: 'Payment Successful',
      description: 'Your payment was successful!',
      variant: 'default',
    })
  }

  const handlePaymentError = (error) => {
    toast({
      title: 'Payment Failed',
      description:
        error.message || 'There was an issue processing your payment.',
      variant: 'destructive',
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/categories"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
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
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
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
                <div className="space-y-6">
                  {/* Display all cart items */}
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 pb-4 border-b"
                    >
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
                        <p className="text-xs text-gray-400">Seller</p>
                        <div className="flex justify-between items-center mt-1">
                          <span>
                            {formatPrice(item.price.amount)} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            {formatPrice(item.price.amount * item.quantity)}
                          </span>
                        </div>
                      </div>
                      {!isCheckingOut && !isPaymentComplete && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeItem(item._id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                        </Button>
                      )}
                    </div>
                  ))}

                  {items.length > 0 && !isCheckingOut && !isPaymentComplete && (
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        className="text-red-500"
                        onClick={clearCart}
                      >
                        Clear Cart
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment Section */}
        <div>
          {isCheckingOut ? (
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <StripeProvider>
                  <EmbeddedCheckout />
                </StripeProvider>

                {!isPaymentComplete && (
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setIsCheckingOut(false)}
                  >
                    Back to Cart
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
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

                {items.length > 0 && !isPaymentComplete ? (
                  <Button
                    className="w-full mt-4"
                    onClick={initiateCheckout}
                    disabled={items.length === 0}
                  >
                    Checkout
                  </Button>
                ) : isPaymentComplete ? (
                  <div className="text-center pt-4">
                    <p className="text-green-600 mb-4">Payment complete!</p>
                    <Link href="/categories">
                      <Button className="w-full">Continue Shopping</Button>
                    </Link>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
