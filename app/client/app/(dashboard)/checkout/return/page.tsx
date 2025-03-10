"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { CheckCircle, ShoppingCart, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';

const ReturnPage = () => {
    const [status, setStatus] = useState<string>('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const clearCart = useCartStore((state) => state.clearCart);

    useEffect(() => {
        const checkoutStatus = async () => {
            try {
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                const sessionId = urlParams.get('session_id');

                if (!sessionId) {
                    setError("No session ID found");
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/session-status?session_id=${sessionId}`);
                const { data: { status, customer_email }} = await response.json();

                
                setStatus(status);
                setCustomerEmail(customer_email);
                setLoading(false);

                if (status === 'complete') {
                    clearCart();
                    console.log("Cart cleared successfully");
                }
            } catch (err) {
                console.error("Error fetching checkout status:", err);
                setError("Something went wrong. Please contact support.");
                setLoading(false);
            }
        };

        checkoutStatus();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <h2 className="text-xl font-semibold text-gray-700">Verifying your purchase...</h2>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-500 text-2xl">!</span>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-700">Something went wrong</h2>
                        <p className="text-gray-500">{error}</p>
                        <Link href="/" className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    console.log(status);

    if (status === 'complete') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-10 w-10 text-green-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Purchase Successful!</h1>
                        <p className="text-gray-600">
                            Thank you for your purchase. Your order has been processed successfully.
                        </p>
                        
                        {customerEmail && (
                            <div className="flex items-center space-x-2 text-gray-500">
                                <Mail className="h-4 w-4" />
                                <span>Confirmation sent to: {customerEmail}</span>
                            </div>
                        )}
                        
                        <div className="w-full h-px bg-gray-200 my-4"></div>
                        
                        <div className="space-y-4 w-full">
                            <Link href="/orders" className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                View Your Orders
                            </Link>
                            
                            <Link href="/shop" className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // For any other status (expired, open, etc.)
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-500 text-2xl">?</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-700">Payment {status}</h2>
                    <p className="text-gray-500">Your payment status is: {status}.</p>
                    <p className="text-gray-500">If you believe this is an error, please contact our support team.</p>
                    
                    <Link href="/" className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-300 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Return to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ReturnPage