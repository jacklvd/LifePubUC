/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/landing/CategoryIcons.jsx
import React from 'react'
import { Icon } from '@/components/icons'

// Define the type for each category icon
interface CategoryIcon {
    name: any
    title: string
}
// Define the props for the CategoryIcons component
interface CategoryIconsProps {
    icons: CategoryIcon[]
    activeCategory: number | null
    setActiveCategory: (category: number | null) => void
}

const CategoryIcons: React.FC<CategoryIconsProps> = ({
    icons,
    activeCategory,
    setActiveCategory,
}) => {
    return (
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-4 mb-10">
            {icons.map((category, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center"
                    onClick={() => setActiveCategory(activeCategory === index ? null : index)}
                >
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full border transition-all duration-300 flex items-center justify-center mb-2 cursor-pointer
            ${activeCategory === index
                            ? 'border-blue-500 bg-blue-50 shadow-md scale-110'
                            : 'border-gray-200 hover:bg-gray-100 hover:scale-105'}`}
                    >
                        <span className={`text-xl md:text-2xl ${activeCategory === index ? 'text-blue-500' : ''}`}>
                            <Icon name={category.name} />
                        </span>
                    </div>
                    <span className={`text-xs md:text-sm text-center font-medium ${activeCategory === index ? 'text-blue-500' : ''}`}>
                        {category.title}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default CategoryIcons