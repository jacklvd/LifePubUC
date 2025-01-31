import { Request, Response } from 'express';
import Item from '../models/item';

// Define interface for the request body
interface CreateItemRequest {
  title: string;
  description: string;
  category: 'textbook' | 'electronics' | 'furniture' | 'clothing' | 'other';
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  price: {
    amount: number;
    currency: 'USD' | 'EUR' | 'GBP';
    isNegotiable: boolean;
  };
  images?: string[];
 
}

export const createItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      category,
      condition,
      price,
      images
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !condition || !price) {
      res.status(400).json({
        message: 'Missing required fields',
        required: ['title', 'description', 'category', 'condition', 'price']
      });
      return;
    }

    // Validate price
    if (price.amount < 0) {
      res.status(400).json({
        message: 'Price amount cannot be negative'
      });
      return;
    }


    // if (!sellerId) {
    //   res.status(401).json({
    //     message: 'Unauthorized: User must be authenticated to create an item'
    //   });
    //   return;
    // }

    // Create new item
    const newItem = new Item({
      title,
      description,
      category,
      condition,
      price: {
        amount: price.amount,
      },
      images: images || [],
      status: 'available',
     
    //   views: 0
    });

    // Save the item
    await newItem.save();

    res.status(201).json({
      message: 'Item created successfully',
      data: newItem
    });

  } catch (error: any) {
    console.error('Error creating item:', error);

    res.status(500).json({
      message: 'Error creating item', error
    });
  }
};

// Example usage of the controller:
/*
POST /api/items
{
  "title": "Computer Science Textbook",
  "description": "Introduction to Algorithms, 3rd Edition",
  "category": "textbook",
  "condition": "good",
  "price": {
    "amount": 45.99,
    "currency": "USD",
    "isNegotiable": true
  },
  "images": [
    "https://example.com/image1.jpg"
  ],
  "tradePreference": {
    "acceptsTrade": true,
    "preferredItems": ["Other CS textbooks"]
  }
}
*/