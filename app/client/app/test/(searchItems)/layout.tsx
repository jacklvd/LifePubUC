"use client";
// layout.tsx
import React from 'react';
import Head from 'next/head';
import './styles/globals.css';
import Navbar from '@/components/navbar';
import store, { persistor } from "../components/cartStore/cartStore";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
  
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <div>
      <Head>
        <title>Amazon</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>
      <header>
      
      <Navbar />
        
      </header>
      <main>{children}</main>
      <footer>
        <div className="firstpanel">Back to top</div>
        <div className="secondpanel">
          <ul>
            <p>Get to Know Us</p>
            <a>Careers</a>
            <a>Blog</a>
            <a>About Amazon</a>
            <a>Investor Relations</a>
            <a>Amazon Devices</a>
            <a>Amazon Science</a>
          </ul>
          <ul>
            <p>Make Money with Us</p>
            <a>Sell products on Amazon</a>
            <a>Sell on Amazon Business</a>
            <a>Sell apps on Amazon</a>
            <a>Become an Affiliate</a>
            <a>Self-Publish with Us</a>
            <a>Host an Amazon Hub</a>
            <a>›See More Make Money with Us</a>
          </ul>
          <ul>
            <p>Amazon Payment Products</p>
            <a>Amazon Business Card</a>
            <a>Shop with Points</a>
            <a>Reload Your Balance</a>
            <a>Amazon Currency Converter</a>
          </ul>
          <ul>
            <p>Let Us Help You</p>
            <a>Amazon and COVID-19</a>
            <a>Your Account</a>
            <a>Your Orders</a>
            <a>Shipping Rates & Policies</a>
            <a>Returns & Replacements</a>
            <a>Manage Your Content and Devices</a>
            <a>Amazon Assistant</a>
            <a>Help</a>
          </ul>
        </div>
        <div className="thirdpanel">
          <div className="logo"></div>
          <div className="select-op">
            <select className="sele">
              <option value="En">English</option>
            </select>
            <select className="sele">
              <option value="1">$ USD - U.S. Dollar</option>
            </select>
            <select className="sele">
              <option value="4">United States</option>
            </select>
          </div>
        </div>
        <div className="panel4">
          <div className="page">
            <a href="">Conditions of Use</a>
            <a href="">Privacy Notice</a>
            <a href="">Your Ads Privacy Choices</a>
          </div>
          <div className="copyright">
            © 1996-2023, Amazon.com, Inc. or its affiliates
          </div>
        </div>
      </footer>
    </div>
    </PersistGate>
    </Provider>
  );
};

export default Layout;