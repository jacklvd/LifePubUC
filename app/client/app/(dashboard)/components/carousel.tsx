import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'
import { carouselSlides } from '@/constants'

const FeaturedCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const totalSlides = carouselSlides.length
    const autoSlideInterval = 5000

    // Fix the TypeScript error by using the correct type
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    // Carousel functionality
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

    const resetCarouselInterval = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }
        intervalRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides)
        }, autoSlideInterval)
    }, [totalSlides])

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides)
        resetCarouselInterval()
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
        resetCarouselInterval()
    }

    // Select slide directly
    const goToSlide = (index: React.SetStateAction<number>) => {
        setCurrentSlide(index)
        resetCarouselInterval()
    }

    // Handle keyboard navigation for carousel
    useEffect(() => {
        const handleKeyDown = (e: { key: string }) => {
            if (e.key === 'ArrowLeft') {
                prevSlide()
            } else if (e.key === 'ArrowRight') {
                nextSlide()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    return (
        <div className="relative w-full rounded-lg overflow-hidden bg-gradient-to-r from-sky-400 to-blue-500 mb-10 shadow-lg transition-all duration-300 hover:shadow-xl">
            {/* Carousel content and navigation - same as before */}
            <div className="relative" style={{ height: '280px' }}>
                {carouselSlides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full transition-all duration-700 ${index === currentSlide
                            ? 'opacity-100 translate-x-0'
                            : index < currentSlide
                                ? 'opacity-0 -translate-x-full'
                                : 'opacity-0 translate-x-full'
                            }`}
                    >
                        {/* Slide content */}
                        <div className="flex h-full">
                            <div className="flex-1 p-8 flex flex-col justify-center">
                                <h2 className="text-white font-bold text-2xl">
                                    {slide.title}
                                </h2>
                                <h3 className="text-white font-bold text-4xl mb-6 drop-shadow-md">
                                    {slide.subtitle}
                                </h3>
                                <Button className="bg-orange-600 hover:bg-orange-700 text-white w-40 transform transition-transform duration-300 hover:scale-105">
                                    {slide.cta}
                                </Button>
                            </div>
                            <div className="flex-1 flex justify-center items-center gap-4 p-4 md:w-1/2">
                                {slide.features.map((feature, idx) => (
                                    <div key={idx} className="relative w-40 h-40 overflow-hidden rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                        <div className="h-full w-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                                            <p className="font-bold text-white text-center px-2">{feature.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Navigation buttons */}
                <Button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 h-auto shadow-md z-10"
                    aria-label="Previous slide"
                >
                    <Icon name="ChevronLeft" className="h-4 w-4 md:h-6 md:w-6" />
                </Button>
                <Button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 h-auto shadow-md z-10"
                    aria-label="Next slide"
                >
                    <Icon name="ChevronRight" className="h-4 w-4 md:h-6 md:w-6" />
                </Button>

                {/* Dots navigation */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`block h-3 w-3 rounded-full transition-all duration-300 ${index === currentSlide
                                ? 'bg-white w-6'
                                : 'bg-white/50 hover:bg-white/70'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FeaturedCarousel