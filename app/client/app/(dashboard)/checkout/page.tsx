"use client"
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import Image from 'next/image';

// Load stripe with environment variable
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

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

// Main Profile Page Component
const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [showCardSection, setShowCardSection] = useState(false);

  return (
    <div className="max-w-7xl mx-auto bg-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <div className="w-36 h-12 relative">
          {/* Replace with your actual logo */}
          <div className="text-xl font-bold">Logo</div>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          <div className="cursor-pointer hover:text-indigo-600">Browse Events</div>
          <div className="cursor-pointer hover:text-indigo-600">Create an event</div>
          <div className="cursor-pointer hover:text-indigo-600">Organize</div>
          <div className="cursor-pointer hover:text-indigo-600">Help</div>
          <div className="text-gray-600 font-medium">khongbiet1145@gmail.com</div>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-50 border-r border-gray-200">
          <div className="py-4 px-6 border-b border-gray-200 font-semibold text-lg">Account</div>
          <nav className="py-2">
            <div 
              className={`py-3 px-6 cursor-pointer hover:bg-gray-100 ${activeTab === 'contact' ? 'bg-white font-medium text-indigo-600 border-l-4 border-indigo-600' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              Contact Info
            </div>
            <div className="py-3 px-6 cursor-pointer hover:bg-gray-100">
              Change Email
            </div>
            <div className="py-3 px-6 cursor-pointer hover:bg-gray-100">
              Password
            </div>
            <div 
              className={`py-3 px-6 cursor-pointer hover:bg-gray-100 ${showCardSection ? 'bg-white font-medium text-indigo-600 border-l-4 border-indigo-600' : ''}`}
              onClick={() => setShowCardSection(!showCardSection)}
            >
              Credit/Debit Cards
            </div>
            <div className="py-3 px-6 cursor-pointer hover:bg-gray-100">
              Linked Accounts
            </div>
            <div className="py-3 px-6 cursor-pointer hover:bg-gray-100">
              Email Preferences
            </div>
            <div className="py-3 px-6 cursor-pointer hover:bg-gray-100">
              Close Account
            </div>
            <div className="py-3 px-6 cursor-pointer hover:bg-gray-100">
              Personal Data
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {showCardSection ? (
            <CreditCardManager />
          ) : (
            <div>
              <h1 className="text-3xl font-semibold mb-8 pb-2 border-b-2 border-green-400 inline-block text-gray-900">Account Information</h1>
              
              {/* Profile Photo Section */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Profile Photo</h2>
                <div className="flex justify-center">
                  <div className="w-52 h-52 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center p-4 cursor-pointer hover:border-gray-400 transition-colors">
                    <div className="text-3xl text-indigo-600 mb-2">👤</div>
                    <div className="text-center text-indigo-600 font-medium">
                      ADD A PROFILE<br />IMAGE
                    </div>
                    <div className="text-center text-sm text-gray-500 mt-2">
                      Drag and drop or choose a file to upload
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact Information Section */}
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact Information</h2>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Prefix</label>
                  <select className="w-full sm:w-36 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">--</option>
                    <option value="mr">Mr.</option>
                    <option value="mrs">Mrs.</option>
                    <option value="ms">Ms.</option>
                    <option value="dr">Dr.</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium">First Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter first name" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter last name" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-gray-200 text-right text-sm text-gray-500">
        <div>Account since Feb 27, 2025</div>
      </footer>
    </div>
  );
};

export default ProfilePage;