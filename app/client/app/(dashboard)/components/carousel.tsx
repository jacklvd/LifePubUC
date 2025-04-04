'use client'

import React, { useState, useEffect, useCallback } from 'react'
// import Image from 'next/image'
// import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
// import { Button } from '@/components/ui/button'

interface CarouselSlide {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  buttonText: string
  buttonLink: string
  color: string
}

const EventCarousel: React.FC = () => {
  // Sample carousel data
  const slides: CarouselSlide[] = [
    {
      id: '1',
      title: 'Music Festival',
      subtitle: 'Experience live performances from your favorite artists',
      imageUrl: '/api/placeholder/1200/400',
      buttonText: 'Get Tickets',
      buttonLink: '/events/music-festival',
      color: 'from-purple-700 to-blue-500'
    },
    {
      id: '2',
      title: 'Food & Wine Expo',
      subtitle: 'Discover culinary delights from around the world',
      imageUrl: '/api/placeholder/1200/400',
      buttonText: 'Learn More',
      buttonLink: '/events/food-expo',
      color: 'from-red-600 to-orange-400'
    },
    {
      id: '3',
      title: 'Tech Conference',
      subtitle: 'Connect with industry leaders and innovators',
      imageUrl: '/api/placeholder/1200/400',
      buttonText: 'Register Now',
      buttonLink: '/events/tech-conference',
      color: 'from-blue-600 to-teal-400'
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  // Function to go to next slide
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    )
  }, [slides.length])

  // Function to go to previous slide
  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    )
  }, [slides.length])

  // Function to handle dot navigation
  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    // Reset auto-play timer when manually navigating
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  // Set up auto-play for carousel
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide()
      }, 5000) // Change slide every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAutoPlaying, nextSlide])

  // Handle touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      nextSlide()
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      prevSlide()
    }
  }

  return (
    <div className="relative w-full mb-12 overflow-hidden rounded-xl shadow-lg">
      {/* Carousel container */}
      <div
        className="relative h-[300px] md:h-[400px] w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out
                      ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 -z-10'}`}
          >
            {/* Background image */}
            <div className="absolute inset-0 w-full h-full">
              {/* <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              /> */}
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-70`}></div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 text-white-100">
              <div className="max-w-lg">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-md">{slide.title}</h2>
                <p className="text-lg md:text-xl mb-6 drop-shadow-md">{slide.subtitle}</p>
                {/* <Button
                  className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-6 py-2 rounded-full"
                  asChild
                >
                  <Link href={slide.buttonLink}>
                    {slide.buttonText}
                  </Link>
                </Button> */}
              </div>
            </div>
          </div>
        ))}

        {/* Previous/Next buttons */}
        <button
          className="absolute z-20 left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          className="absolute z-20 right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots navigation */}
        <div className="absolute z-20 bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors
                        ${currentIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default EventCarousel