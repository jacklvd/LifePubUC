// layout.tsx
import React from 'react';
import Head from 'next/head';
import './styles/globals.css';
import Navbar from '@/components/navbar';
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
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
        {/* <nav className="navbar">
          <div className="navlogo">
            <div className="logo border"></div>
          </div>
          <div className="navadd border">
            <p className="addfirst icon">Deliver to</p>
            <div className="addicon">
              <i className="fa-solid fa-location-dot icon"></i>
              <p className="addsecond icon">Cincinnati</p>
            </div>
          </div>
          <div className="nav-search">
            <select className="search-option1">
              <option value="All" className="search-option2">All</option>
            </select>
            <input type="text" placeholder="Search Amazon" className="search-input" />
            <div className="search-icon">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
          </div>
          <div className="languageoption border">
            <div className="american"></div>
            <select className="lanoption">
              <option value="lan">EN</option>
            </select>
          </div>
          <div className="sign border">
            <p className="hello">Hello, sign in</p>
            <div className="account">
              <select className="account-sign">
                <option value="Account">Account & Lists</option>
              </select>
            </div>
          </div>
          <div className="box6 border">
            <p className="return">Returns</p>
            <p className="order">& Orders</p>
          </div>
          <div className="cart border">
            <i className="fa-solid fa-cart-shopping"></i>
            cart
          </div>
        </nav> */}
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
  );
};

export default Layout;