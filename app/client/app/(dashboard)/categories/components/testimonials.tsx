import React from 'react'
import { Icon } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const Testimonials = ({ testimonials = [], showViewAll = true }) => {
  return (
    <div className="space-y-4">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="border-b border-gray-100 pb-4 last:border-0">
          <div className="flex items-center gap-3 mb-2">
            <Avatar>
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
              <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{testimonial.name}</div>
              <div className="text-xs text-gray-500">{testimonial.date}</div>
            </div>
          </div>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon 
                key={star} 
                name="Star" 
                className={star <= testimonial.rating ? 'text-yellow-400' : 'text-gray-300'} 
                size={14} 
              />
            ))}
          </div>
          <p className="text-gray-700">{testimonial.comment}</p>
        </div>
      ))}
      
      {showViewAll && testimonials.length > 0 && (
        <div className="mt-4 text-center">
          <Button variant="outline">
            View All Reviews
          </Button>
        </div>
      )}
      
      {testimonials.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Icon name="MessageSquare" size={40} className="mx-auto" />
          </div>
          <p className="text-gray-500">No reviews yet</p>
        </div>
      )}
    </div>
  )
}

export default Testimonials