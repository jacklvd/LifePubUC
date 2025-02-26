import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, Heart } from "lucide-react";


interface ItemCardProps {
  item: {
    title: string;
    description: string;
    category: string;
    condition: string;
    price: {
      amount: number;
    };
    images: string[];
    status: string;
    views: number;
  };
}

const ItemCard = ({ item }: ItemCardProps) => {
  const [isInCart, setIsInCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getConditionColor = (condition: string) => {
    const colors = {
      new: 'bg-green-500',
      like_new: 'bg-emerald-400',
      good: 'bg-blue-400',
      fair: 'bg-yellow-400',
      poor: 'bg-red-400'
    };
    return colors[condition as keyof typeof colors] || 'bg-gray-400';
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      available: 'bg-green-500',
      sold: 'bg-red-500',
      reserved: 'bg-yellow-500'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-500';
  };

  const handleCartClick = () => {
    setIsInCart(!isInCart);
    
    // Reset to cart icon after 1.5 seconds if added to cart
    if (!isInCart) {
      setTimeout(() => {
        setIsInCart(false);
      }, 1500);
    }
  };

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <Card className="group w-full max-w-sm hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="group relative w-full h-48 mb-4">
          <Image
            src={item.images[0] || '/placeholder-image.jpg'}
            alt={item.title}
            fill
            className="object-cover rounded-t-lg"
          />
          {item.status === 'available' && (
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              <Button
                size="icon"
                className="rounded-full bg-white opacity-0 group-hover:opacity-100 shadow-md  transition-all duration-300"
                onClick={handleCartClick}
              >
                {isInCart ? (
                  <Check className="h-4 w-4 text-gray-700 transition-all" />
                ) : (
                  <ShoppingCart className="h-4 w-4 text-gray-700 transition-all" />
                )}
              </Button>
              
              <Button
                size="icon"
                className="rounded-full opacity-0 group-hover:opacity-100 bg-white shadow-md  transition-all duration-300"
                onClick={handleFavoriteClick}
              >
                <Heart 
                  className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} 
                />
              </Button>
            </div>
          )}
        </div>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{item.title}</CardTitle>
          <Badge className={getStatusBadge(item.status)}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 line-clamp-2 mb-4">{item.description}</p>
        <div className="flex justify-between items-center">
          <Badge variant="outline" className={getConditionColor(item.condition)}>
            {item.condition.replace('_', ' ').toUpperCase()}
          </Badge>
          <span className="text-xl font-bold">
            {formatPrice(item.price.amount)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-gray-500">
        <span>Category: {item.category}</span>
        <span>{item.views} views</span>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;