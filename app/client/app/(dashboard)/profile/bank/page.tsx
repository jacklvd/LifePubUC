/* NOT DONE */
"use client"

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';

// Load stripe with environment variable
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

// Card Input Component
const CardForm = ({ onCardSaved }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cardName, setCardName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (error) {
      elements.getElement('card').focus();
      return;
    }

    if (cardComplete) {
      setProcessing(true);
    }

    const payload = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        name: cardName,
      },
    });

    setProcessing(false);

    if (payload.error) {
      setError(payload.error);
    } else {
      setError(null);
      onCardSaved(payload.paymentMethod);
      elements.getElement(CardElement).clear();
      setCardName('');
    }
  };

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mt-8">
      <div className="mb-4">
        <label htmlFor="cardName" className="block mb-1 font-medium">Name on Card</label>
        <input
          type="text"
          id="cardName"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="Name as it appears on your card"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="cardElement" className="block mb-1 font-medium">Credit or Debit Card</label>
        <div className="p-3 border border-gray-300 rounded-md bg-white">
          <CardElement 
            id="cardElement" 
            options={cardStyle} 
            onChange={(e) => {
              setError(e.error);
              setCardComplete(e.complete);
            }}
          />
        </div>
      </div>
      {error && <div className="text-red-600 mb-4 text-sm">{error.message}</div>}
      <button 
        type="submit" 
        disabled={!stripe || processing || !cardComplete || !cardName}
        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
      >
        {processing ? "Processing..." : "Save Card"}
      </button>
    </form>
  );
};

// Credit Card Management Component
const CreditCardManager = () => {
  const [showCardForm, setShowCardForm] = useState(false);
  const [savedCards, setSavedCards] = useState([]);

  const handleCardSaved = (paymentMethod) => {
    const newCard = {
      id: paymentMethod.id,
      brand: paymentMethod.card.brand,
      last4: paymentMethod.card.last4,
      expMonth: paymentMethod.card.exp_month,
      expYear: paymentMethod.card.exp_year,
    };
    
    setSavedCards([...savedCards, newCard]);
    setShowCardForm(false);
  };

  const handleDeleteCard = (cardId) => {
    setSavedCards(savedCards.filter(card => card.id !== cardId));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Credit/Debit Cards</h2>
      
      {savedCards.length > 0 ? (
        <div className="space-y-4 mb-6">
          {savedCards.map(card => (
            <div key={card.id} className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-md">
              <div className="space-y-1">
                <span className="block font-medium capitalize">{card.brand}</span>
                <span className="block text-gray-600">•••• {card.last4}</span>
                <span className="block text-sm text-gray-500">Expires {card.expMonth}/{card.expYear}</span>
              </div>
              <button 
                onClick={() => handleDeleteCard(card.id)}
                className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 mb-6">No payment methods on file.</p>
      )}
      
      {showCardForm ? (
        <Elements stripe={stripePromise}>
          <CardForm onCardSaved={handleCardSaved} />
        </Elements>
      ) : (
        <button 
          onClick={() => setShowCardForm(true)}
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add Credit/Debit Card
        </button>
      )}
    </div>
  );
};

export default function BankPage() {
  return <CreditCardManager />;
}