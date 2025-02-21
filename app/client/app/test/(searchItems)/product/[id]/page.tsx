"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { addItem } from '../../../components/cartSlice/cartSlice';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../components/cartStore/cartStore";
const ProductPage: React.FC = () => {
  const params = useParams();
  const { id } = params;
  const dispatch = useDispatch();

  // Define the product details based on the page
  const product = {
    id: Number(id) || 1, // use id from URL or default to 1
    name: "EYEBOGLER Regular Fit Men's Cotton T-Shirt",
    quantity: 1, // Default quantity 1 when adding
    price: 449.0,
    image: "https://i.ibb.co/xYpFY0T/item1.jpg",
    alt: "Main Product",
  };

  const handleAddToCart = () => {

    dispatch(addItem(product));
  };

  return (
    <section className="flex flex-col md:flex-row gap-8 p-4 max-w-6xl mx-auto">
      <div className="flex w-full md:w-1/2">
        <div className="flex flex-col gap-4 w-1/5 overflow-y-auto">
          {[
            "https://i.ibb.co/VJf6fXm/thumb1.jpg",
            "https://i.ibb.co/Jt5zc58/thumb2.jpg",
            "https://i.ibb.co/Yf9LMpy/thumb3.jpg",
            "https://i.ibb.co/60hPGy2/thumb4.jpg",
          ].map((src, idx) => (
            <div
              key={idx}
              className="border p-1 hover:border-orange-500 hover:shadow-md cursor-pointer"
            >
              <img src={src} alt={`thumbnail-${idx}`} className="w-full h-auto" />
            </div>
          ))}
        </div>
        <div className="w-4/5 p-4">
          <img
            src="https://i.ibb.co/xYpFY0T/item1.jpg"
            alt="Main Product"
            className="w-full h-auto border"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2">
        <div className="mb-4">
          <h4 className="text-xl font-medium">
            EYEBOGLER Regular Fit Men's Cotton T-Shirt
          </h4>
          <div className="text-yellow-400 text-lg mb-2">
            ★★★★<span className="text-gray-400">★</span>
          </div>
          <p className="text-gray-600 mb-4">
            Price:{" "}
            <span className="text-red-600 text-xl font-semibold">₹ 449.00</span>
          </p>
        </div>

        <div className="mb-4">
          <label className="font-bold">Colour:</label> <span>Black</span>
          <div className="flex gap-2 mt-2">
            {[
              "https://i.ibb.co/QjkJJk3/select1.jpg",
              "https://i.ibb.co/C297yD0/select2.jpg",
            ].map((src, idx) => (
              <div
                key={idx}
                className="border p-1 w-10 h-10 hover:border-orange-500 cursor-pointer"
              >
                <img src={src} alt={`color-${idx}`} className="w-full h-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="font-bold">Size:</label>
          <select className="border rounded-md p-2 mt-2">
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
            <option>2XL</option>
          </select>
        </div>

        <div>
          <ul className="list-disc list-inside text-gray-700">
            <li>Care Instructions: Machine Wash</li>
            <li>Fit Type: Classic Fit</li>
            <li>Color name: Black-White</li>
            <li>Material: Cotton</li>
            <li>Pattern: Solid</li>
          </ul>
        </div>

        <div className="mt-6">
          <button
            onClick={handleAddToCart}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
