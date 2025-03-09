import { Appearance, loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { useEffect, useState } from "react";
import { Elements } from '@stripe/react-stripe-js';
import { createStripePaymentIntent } from '@/lib/actions/stripe-actions';

import { useCartStore } from '@/store/cart';
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not set")
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const appearance: Appearance = {
    theme: "stripe",
    variables: {
        colorPrimary: "#0570de",
        colorBackground: "#18181b",
        colorText: "#d2d2d2",
        colorDanger: "#df1b41",
        colorTextPlaceholder: "#6e6e6e",
        fontFamily: "Inter, system-ui, sans-serif",
        spacingUnit: "3px",
        borderRadius: "10px",
        fontSizeBase: "14px",
    },
};

const StripeProvider = ({ children }: { children: React.ReactNode }) => {
    const [clientSecret, setClientSecret] = useState<string>("");
    const totalAmount = useCartStore((state) => state.totalAmount);
    const items = useCartStore((state) => state.items);

    // Need to create payment intent here
    useEffect(() => {
        
        const fetchPaymentIntent = async () => {
            console.log("Hello world");
            const response = await createStripePaymentIntent(
                { cartItems: items }
            )


            console.log(response);
            if (response.success) {

                setClientSecret(response.data)
            }




        }

        fetchPaymentIntent()

        
    }, [items, totalAmount])

    if (!clientSecret) {
        return <div>Please be patient</div>
    }

    console.log("clientSecret: ", clientSecret);

    const options: StripeElementsOptions = {
        clientSecret,
        appearance
    }

    return (
        <Elements stripe={stripePromise} options={options}>
            {children}
        </Elements>
    )
}

export default StripeProvider