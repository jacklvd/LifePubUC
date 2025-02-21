"use client";
// page.tsx
import React from 'react';
import Link from 'next/link';


const HomePage: React.FC = () => {
  const productImages = [
    "https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2021/September/DashboardCards/Fuji_Dash_Toys_1X._SY304_CB639759658_.jpg",
    "https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2021/September/DashboardCards/Fuji_Dash_SmartWatch_1X._SY304_CB639922137_.jpg",
    "https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2022/February/DashboardCards/GW_CONS_AUS_HPC_HPCEssentials_CatCard_Desktop1x._SY304_CB627424361_.jpg",
    "https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2021/September/DashboardCards/Fuji_Dash_Toys_1X._SY304_CB639759658_.jpg",
    "https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2021/September/DashboardCards/Fuji_Dash_Fitness_1X._SY304_CB639748186_.jpg",
    "https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2021/September/DashboardCards/Fuji_Desktop_Dash_Kindle_1x._SY304_CB639752818_.jpg",
    "https://images-na.ssl-images-amazon.com/images/G/01/home/THILGMA/SpringEvent2023/XCM_CUTTLE_1559454_3018199_379x304_1X_en_US._SY304_CB592739737_.jpg",
    "https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2020/May/Dashboard/Fuji_Dash_Laptops_379x304_1X_en_US._SY304_CB418608471_.jpg"
  ];

  return (
      <div className="bg-gray-100 p-4">
      <div className="relative mb-4">
        <img
          src="https://m.media-amazon.com/images/I/81KkrQWEHIL._SX3000_.jpg"
          alt="Amazon Banner"
          className="w-full h-60 object-cover rounded-md shadow-md"
        />
        <div className="absolute bottom-4 left-4 bg-white p-2 shadow-md rounded-md text-sm">
          <p>
            You are on amazon.com. You can also shop on Amazon India for millions of
            products with fast local delivery.{' '}
            <a href="#" className="text-blue-500 hover:underline">Click here to go to amazon.in</a>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {["Toys Under $30", "Deals & Promotions", "Health & Personal Care", "New arrivals in Toys", "For your Fitness Needs", "Kindle E readers", "Home refresh ideas", "Shop Laptops & Tablets"].map((title, idx) => (
          <div className="bg-white p-4 shadow-md rounded-md" key={idx}>
            <h2 className="text-lg font-bold mb-2">{title}</h2>
            <img
              src={productImages[idx]}
              alt={title}
              className="h-40 w-full object-cover mb-4 rounded-md"
            />
            <p>
            <Link href={`test/product/${idx}`} className="text-blue-500 hover:underline">Shop now</Link>
            </p>
          </div>
        ))}
      </div>
    </div>
    
  );
};

export default HomePage;
