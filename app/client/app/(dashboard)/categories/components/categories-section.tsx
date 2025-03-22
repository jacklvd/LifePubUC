import React from 'react'
import CategoryCard from './category-card'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'



const CategoriesSection = ({ categories, selectedCategory, onCategorySelect }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-3 py-8 bg-white">
      <h1 className="text-4xl font-bold">Categories</h1>
      <p className="text-gray-500 mb-4">
        Books, clothing, tickets, souvenirs - we have it all
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 max-w-7xl mx-auto px-4">
        {categories.map((category, index) => (
          <div 
            key={index} 
            onClick={() => onCategorySelect(category.title)}
            className={`cursor-pointer transition-all duration-200 ${
              selectedCategory === category.title 
                ? 'ring-2 ring-blue-500 scale-105' 
                : 'hover:scale-105'
            }`}
          >
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
      
      <Button
        className="mt-4 rounded-full border hover:border-black hover:bg-gray-200 hover:border-3 transition-all"
        variant="outline"
      >
        <Icon name="Plus" className="mr-2" width={16} />
        <p>More Categories</p>
      </Button>
    </div>
  )
}

export default CategoriesSection