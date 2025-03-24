'use client'

import React from 'react'

interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  maxStars?: number
  className?: string
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 'md',
  maxStars = 5,
  className = '',
}) => {
  // Determine star size based on prop
  const getStarSize = () => {
    switch (size) {
      case 'sm':
        return 14
      case 'lg':
        return 24
      case 'md':
      default:
        return 18
    }
  }

  const starSize = getStarSize()

  // Calculate full and partial stars
  const fullStars = Math.floor(rating)
  const partialStar = rating % 1
  const emptyStars = Math.floor(maxStars - rating)

  return (
    <div className={`flex items-center ${className}`}>
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          width={starSize}
          height={starSize}
          viewBox="0 0 24 24"
          fill="#FFB800"
          className="text-yellow-400"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}

      {/* Partial star if needed */}
      {partialStar > 0 && (
        <svg
          key="partial"
          xmlns="http://www.w3.org/2000/svg"
          width={starSize}
          height={starSize}
          viewBox="0 0 24 24"
          className="text-yellow-400"
        >
          <defs>
            <linearGradient id={`partialFill-${rating}`}>
              <stop offset={`${partialStar * 100}%`} stopColor="#FFB800" />
              <stop offset={`${partialStar * 100}%`} stopColor="#E5E7EB" />
            </linearGradient>
          </defs>
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={`url(#partialFill-${rating})`}
          />
        </svg>
      )}

      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          width={starSize}
          height={starSize}
          viewBox="0 0 24 24"
          fill="#E5E7EB"
          className="text-gray-200"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export default StarRating
