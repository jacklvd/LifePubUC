import React from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Testimonials from './testimonials'

const ItemDetail = ({ 
  item, 
  onBack, 
  onAddToCart, 
  similarItems,
  onSimilarItemSelect
}) => {
  // Sample testimonials (in real app, these would be fetched from the backend)
  const testimonials = [
    {
      id: 1,
      name: 'Alex Johnson',
      avatar: '/avatars/alex.jpg',
      rating: 5,
      comment: 'The quality of this hoodie is amazing! Fabric is soft and the logo looks perfect.',
      date: '2 weeks ago'
    },
    {
      id: 2,
      name: 'Sarah Miller',
      avatar: '/avatars/sarah.jpg',
      rating: 4,
      comment: 'Love my university mug, use it every day for my morning coffee before lectures.',
      date: '1 month ago'
    },
    {
      id: 3,
      name: 'David Chen',
      avatar: '/avatars/david.jpg',
      rating: 5,
      comment: 'The event tickets were easy to purchase and the QR code worked perfectly at entry.',
      date: '3 weeks ago'
    }
  ]
  
  return (
    <div className="space-y-8">
      {/* Item Detail View */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between mb-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center text-gray-500"
          >
            <Icon name="ArrowLeft" className="mr-2" size={16} />
            <span>Back to items</span>
          </Button>
          <Button variant="ghost">
            <Icon name="Heart" size={16} />
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
            <img 
              src={item.imageUrl || '/placeholder-image.jpg'} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{item.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon 
                    key={star} 
                    name="Star" 
                    className={star <= (item.rating || 5) ? 'text-yellow-400' : 'text-gray-300'} 
                    size={16} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({item.reviewCount || 0} reviews)
              </span>
            </div>
            
            <div className="text-2xl font-bold text-blue-700">
              ${item.price?.toFixed(2)}
            </div>
            
            <p className="text-gray-700">{item.description}</p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon name="Check"