/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import {
  Search,
  Calendar,
  MapPin,
  Mic,
  Disc,
  Palette,
  Heart,
  Gamepad2,
  Briefcase,
  Utensils,
} from 'lucide-react'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'

const categories = [
  { name: 'Music', icon: <Mic className="w-6 h-6" /> },
  { name: 'Nightlife', icon: <Disc className="w-6 h-6" /> },
  { name: 'Performing & Visual Arts', icon: <Palette className="w-6 h-6" /> },
  { name: 'Holidays', icon: <Calendar className="w-6 h-6" /> },
  { name: 'Dating', icon: <Heart className="w-6 h-6" /> },
  { name: 'Hobbies', icon: <Gamepad2 className="w-6 h-6" /> },
  { name: 'Business', icon: <Briefcase className="w-6 h-6" /> },
  { name: 'Food & Drink', icon: <Utensils className="w-6 h-6" /> },
]

const images = [
  'https://png.pngtree.com/thumb_back/fh260/background/20230706/pngtree-flourishing-e-commerce-industry-3d-illustration-of-online-marketplaces-image_3822994.jpg',
  'https://media.istockphoto.com/id/978368192/photo/famous-tuscany-landscape-with-curved-road-and-cypress-italy-europe.jpg?s=612x612&w=0&k=20&c=iGs6vInuZHiv8NW73CwGyr_zvPdt5kRwna28jHS5CZ0=',
  'https://plus.unsplash.com/premium_photo-1669868118352-850ff89778b3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG9yaXpvbnRhbCUyMGxhbmRzY2FwZXxlbnwwfHwwfHx8MA%3D%3D',
]

const LandingPage = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <section className="py-10 bg-pink-200 text-white">
        <Carousel className="max-w-5xl mx-auto relative">
          <CarouselContent className="relative w-full h-96 overflow-hidden">
            {images.map((src, index) => (
              <CarouselItem
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeIndex ? 'opacity-100 z-10' : 'opacity-0'}`}
              >
                <Image
                  src={src}
                  fill
                  className="object-cover rounded-lg"
                  alt="Online Marketplaces"
                  priority
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            onClick={() =>
              setActiveIndex((activeIndex - 1 + images.length) % images.length)
            }
          />
          <CarouselNext
            onClick={() => setActiveIndex((activeIndex + 1) % images.length)}
          />
        </Carousel>
      </section>

      <section className="p-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 text-center">
        {categories.map((category) => (
          <div key={category.name} className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-md">
              {category.icon}
            </div>
            <p className="text-sm font-medium">{category.name}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

export default LandingPage
