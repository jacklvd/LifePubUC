import { Appearance, loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { useEffect, useState } from "react";
import { EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { createStripePaymentIntent } from '@/lib/actions/stripe-actions';

import { useCartStore } from '@/store/cart';
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not set")
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const StripeProvider = ({ children }: { children: React.ReactNode }) => {
    const [clientSecret, setClientSecret] = useState<string>("");
    const totalAmount = useCartStore((state) => state.totalAmount);
    const items = useCartStore((state) => state.items);

    useEffect(() => {
        
        const fetchPaymentIntent = async () => {
            console.log("Hello world");
            const response = await createStripePaymentIntent(
                { cartItems: items }
            )
            // console.log(response);
            
            if (response.success) {

                setClientSecret(response.data)
            }
        }

        fetchPaymentIntent()

        
    }, [items, totalAmount])

    if (!clientSecret) {
        return <div>Please be patient</div>
    }

    const options: StripeElementsOptions = {
        clientSecret,
        
    }

    return (
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            {children}
        </EmbeddedCheckoutProvider>
    )
}

export default StripeProvider