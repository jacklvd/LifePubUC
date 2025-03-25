import React from 'react'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { landingPageIcons } from '@/constants'

interface PopularCategoriesProps {
    setActiveCategory: (index: number | null) => void
    setActiveTab: (index: number) => void
}

const PopularCategories: React.FC<PopularCategoriesProps> = ({
    setActiveCategory,
    setActiveTab,
}) => {
    const categories = ['Music', 'Food & Drink', 'Nightlife', 'Arts']
    const colors = ['#FF6B6B', '#4ECDC4', '#6A0572', '#0072BB']

    return (
        <div className="mb-12">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center">
                <span className="mr-2">🔥</span> Popular Categories
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="relative h-32 rounded-lg overflow-hidden cursor-pointer group shadow-md"
                        onClick={() => {
                            // Find the matching category index in landingPageIcons
                            const categoryIndex = landingPageIcons.findIndex(
                                c => c.title.toLowerCase() === category.toLowerCase()
                            );
                            if (categoryIndex >= 0) {
                                setActiveCategory(categoryIndex);
                                // Set tab to "All" to show just the category filter
                                setActiveTab(0);
                            }
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"></div>
                        <div
                            className="absolute inset-0 opacity-20 group-hover:opacity-0 transition-opacity duration-300"
                            style={{ backgroundColor: colors[index] }}
                        ></div>
                        <Image
                            src="/api/placeholder/400/320"
                            alt={category}
                            width={400}
                            height={200}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                            <h3 className="text-white font-semibold">{category}</h3>
                            <div className="mt-1 flex items-center text-white/80 text-xs">
                                <ArrowRight className="h-3 w-3 mr-1" />
                                <span>Explore events</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PopularCategories