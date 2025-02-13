import React from 'react'
import { categories } from '@/constants/categories'
import CategoryCard from './components/category-card'

const CategoryPage = () => {
  return (
    <div className='w-full min-h-100'>
        {/* Title */}
        <div className='flex flex-col justify-center items-center gap-3 mt-8'>
            <h1 className='text-4xl '>Categories</h1>
            <p className='text-gray-500'>Book, clothing, ticket, souvenirs we have it all</p>
            {/* Card to category */}
            <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5'>
                {categories.map((category, index) => 
                    <CategoryCard
                        key={index}
                        category={category}
                    />
                )}
            </div>
        </div>
        
        {/* Filter bar */}
        <div></div>
        {/* Item List */}
        <div></div>
    </div>
  )
}

export default CategoryPage