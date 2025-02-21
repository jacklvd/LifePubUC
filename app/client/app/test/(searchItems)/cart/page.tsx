"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../components/cartStore/cartStore";
import { increment, decrement } from "../../components/cartSlice/cartSlice";
import "./style.css";

// Declare this so TSX knows about the ion-icon element.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ion-icon": any;
    }
  }
}

const ShoppingCart: React.FC = () => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);

  // Debug: log the Redux state whenever it changes.
  useEffect(() => {
    console.log("Cart state:", items);
  }, [items]);

  const subtotal: number = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const tax: number = subtotal * 0.05;
  const total: number = subtotal + tax;

  const handleIncrement = (index: number): void => {
    dispatch(increment(index));
  };

  const handleDecrement = (index: number): void => {
    dispatch(decrement(index));
  };

  return (
    <main className="container">
      <div className="item-flex">
        <section className="checkout">
          <h2 className="section-heading">Payment Details</h2>
          <div className="payment-form">
            <div className="payment-method">
              <button className="method selected">
                <ion-icon name="card"></ion-icon>
                <span>Credit Card</span>
                <ion-icon name="checkmark-circle" className="checkmark fill"></ion-icon>
              </button>
              <button className="method">
                <ion-icon name="logo-paypal"></ion-icon>
                <span>PayPal</span>
                <ion-icon name="checkmark-circle-outline" className="checkmark"></ion-icon>
              </button>
            </div>
            <form action="#">
              <div className="cardholder-name">
                <label htmlFor="cardholder-name" className="label-default">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="cardholder-name"
                  className="input-default"
                  name="cardholder-name"
                />
              </div>
              <div className="card-number">
                <label htmlFor="card-number" className="label-default">
                  Card Number
                </label>
                <input
                  type="number"
                  id="card-number"
                  className="input-default"
                  name="card-number"
                />
              </div>
              <div className="input-flex">
                <div className="expire-date">
                  <label htmlFor="expire-date" className="label-default">
                    Expiration Date
                  </label>
                  <div className="input-flex">
                    <input
                      type="number"
                      name="day"
                      id="expire-date"
                      className="input-default"
                      placeholder="31"
                      min={1}
                      max={31}
                    />
                    /
                    <input
                      type="number"
                      name="month"
                      id="expire-date"
                      className="input-default"
                      placeholder="12"
                      min={1}
                      max={12}
                    />
                  </div>
                </div>
                <div className="cvv">
                  <label htmlFor="cvv" className="label-default">
                    CVV
                  </label>
                  <input
                    type="number"
                    id="cvv"
                    className="input-default"
                    name="cvv"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="btn-wrapper">
            <button className="btn btn-primary">
              <b>Pay</b> $ <span id="payAmount">{total.toFixed(2)}</span>
            </button>
          </div>
        </section>

        <section className="cart">
          <div className="cart-item-box">
            <h2 className="section-heading">Order Summary</h2>
            {items.map((item, index) => (
              <div className="product-card" key={index}>
                <div className="card">
                  <div className="img-box">
                    <img
                      src={item.image}
                      alt={item.alt}
                      width="80px"
                      className="product-img"
                    />
                  </div>
                  <div className="detail">
                    <h4 className="product-name">{item.name}</h4>
                    <div className="wrapper">
                      <div className="product-qty">
                        <button
                          id="decrement"
                          onClick={() => handleDecrement(index)}
                        >
                            -
                        </button>
                        <span id="quantity">{item.quantity}</span>
                        <button
                          id="increment"
                          onClick={() => handleIncrement(index)}
                        >
                            +
                        </button>
                      </div>
                      <div className="price">
                        <span id="price">{item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <button className="product-close-btn">
                    <ion-icon name="close-outline"></ion-icon>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="wrapper">
            <div className="discount-token">
              <label htmlFor="discount-token" className="label-default">
                Gift Card/Discount Code
              </label>
              <div className="wrapper-flex">
                <input
                  type="text"
                  name="discount-token"
                  id="discount-token"
                  className="input-default"
                />
                <button className="btn btn-outline">Apply</button>
              </div>
            </div>
            <div className="amount">
              <div className="subtotal">
                <span>Subtotal</span>{" "}
                <span>
                  $ <span id="subtotal">{subtotal.toFixed(2)}</span>
                </span>
              </div>
              <div className="tax">
                <span>Tax</span>{" "}
                <span>
                  $ <span id="tax">{tax.toFixed(2)}</span>
                </span>
              </div>
              <div className="shipping">
                <span>Shipping</span>{" "}
                <span>
                  $ <span id="shipping">0.00</span>
                </span>
              </div>
              <div className="total">
                <span>Total</span>{" "}
                <span>
                  $ <span id="total">{total.toFixed(2)}</span>
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ShoppingCart;
