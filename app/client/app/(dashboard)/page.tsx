/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Icon } from '@/components/icons'
import {
  eventTabs,
  landingPageIcons,
  eventsTemp,
  carouselSlides,
} from '@/constants'

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = carouselSlides.length
  const autoSlideInterval = 5000
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Auto slide functionality
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, autoSlideInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [totalSlides])

  const nextSlide = () => {
    // Reset interval when manually changing slides
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, autoSlideInterval)
  }

  const prevSlide = () => {
    // Reset interval when manually changing slides
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, autoSlideInterval)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Carousel */}
      <div className="relative w-full rounded-lg overflow-hidden bg-sky-300 mb-10">
        <div className="relative" style={{ height: '280px' }}>
          {carouselSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
                index === currentSlide
                  ? 'opacity-100'
                  : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="flex h-full">
                <div className="flex-1 p-8 flex flex-col justify-center">
                  <h2 className="text-white font-bold text-2xl">
                    {slide.title}
                  </h2>
                  <h3 className="text-white font-bold text-4xl mb-6">
                    {slide.subtitle}
                  </h3>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white w-40">
                    {slide.cta}
                  </Button>
                </div>
                <div className="flex-1 flex justify-center items-center gap-4 p-4 md:w-1/2">
                  {slide.features.map((feature, idx) => (
                    <div key={idx} className="relative">
                      {/* <Image
                        width={200}
                        height={200}
                        src={feature.image}
                        alt={feature.title}
                        className="rounded-lg object-cover"
                      />
                      <div className={`absolute bottom-0 left-0 right-0 ${feature.bgColor} text-white text-center py-2 px-1`}>
                        <p className="font-bold text-sm md:text-sm">{feature.title}</p>
                      </div> */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <Button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white-100 text-black rounded-full p-2 h-auto"
          >
            <Icon name="ChevronLeft" className="h-4 w-4 md:h-6 md:w-6" />
          </Button>
          <Button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white-100 text-black rounded-full p-2 h-auto"
          >
            <Icon name="ChevronRight" className="h-4 w-4 md:h-6 md:w-6" />
          </Button>
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <span
                key={index}
                className={`block h-2 w-2 rounded-full ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Category Icons */}
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-4 mb-10">
        {landingPageIcons.map((category, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-gray-200 flex items-center justify-center mb-2 cursor-pointer hover:bg-gray-100">
              <span className="text-xl md:text-2xl">
                <Icon name={category.name} />
              </span>
            </div>
            <span className="text-xs md:text-sm text-center">
              {category.title}
            </span>
          </div>
        ))}
      </div>

      {/* Location Dropdown */}
      <div className="flex items-center mb-8">
        <h2 className="text-base md:text-lg font-medium">Browsing events in</h2>
        <div className="ml-2 bg-white border rounded-md px-2 py-1 flex items-center cursor-pointer text-blue-600">
          <span>Cincinnati</span>
          <Icon name="ChevronDown" className="h-4 w-4 ml-1" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-thin">
        {eventTabs.map((tab, index) => (
          <div
            key={index}
            className={`px-4 py-2 whitespace-nowrap cursor-pointer ${
              index === 1 ? 'border-b-2 border-blue-600 text-blue-600' : ''
            }`}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Top Picks */}
      <div className="mb-10">
        <h2 className="text-lg md:text-xl font-semibold mb-6 flex items-center">
          <span className="mr-2">🎭</span> Our top picks for you
        </h2>

        {/* Responsive card grid that wraps to next row */}
        <div className="flex flex-wrap -mx-2">
          {eventsTemp.map((event, index) => (
            <div key={index} className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
              <Card className="h-full overflow-hidden border cursor-pointer hover:shadow-md">
                <Image
                  width={400}
                  height={200}
                  src={event.image}
                  alt={event.title}
                  className="w-full h-40 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1 text-base h-12 line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-sm mb-1">
                    {event.date} • {event.time}
                  </p>
                  <p className="text-sm mb-2 text-gray-600">{event.venue}</p>
                  <p className="text-sm font-semibold">{event.price}</p>
                  {event.organizer && (
                    <p className="text-xs text-gray-500 mt-2">
                      {event.organizer}
                    </p>
                  )}
                  {event.followers && (
                    <p className="text-xs text-gray-500">{event.followers}</p>
                  )}
                  {event.promoted && (
                    <div className="flex items-center mt-2">
                      <span className="text-xs text-gray-500">Promoted</span>
                      <span className="ml-1 text-gray-400">ⓘ</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LandingPage
