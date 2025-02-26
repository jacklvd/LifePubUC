import React from 'react'
import Image from 'next/image'


const CategoryCard = ({ category }: { category: Category}) => {
    return (
        
            <div className='flex flex-col group items-center gap-2'>
                <div className='relative w-[150px] h-[220px] overflow-hidden rounded-lg'>
                    <Image
                        src={category.url}
                        alt={category.title}
                        fill
                        className='object-cover'
                        sizes="(max-width: 768px) 20vw, (max-width: 1200px) 25vw, 16vw"
                    />
                    <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300'></div>
                </div>
                <p className='text-sm font-medium text-center group-hover:underline group-hover:text-primary-800:'>{category.title}</p>
            </div>
       
    )
}
export default CategoryCard