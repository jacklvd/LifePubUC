import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'

interface CheckoutFormProps {
  onSuccess: (paymentIntent: unknown) => void
  onError: (error: unknown) => void
  amount: number
  sellerName: string
}

export const CheckoutForm = ({
  onSuccess,
  onError,
  amount,
  sellerName,
}: CheckoutFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        setErrorMessage(error.message || 'Payment failed')
        onError(error)
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent)
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred')
      onError(error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500">
          Paying {sellerName}
        </h3>
        <p className="text-lg font-bold">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(amount)}
        </p>
      </div>

      <PaymentElement options={{ layout: 'tabs' }} />

      {errorMessage && (
        <div className="mt-4 text-sm text-red-500">{errorMessage}</div>
      )}

      <Button
        type="submit"
        className="w-full mt-4"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            <span>Processing...</span>
          </div>
        ) : (
          <span>Pay Now</span>
        )}
      </Button>
    </form>
  )
}

export default CheckoutForm
