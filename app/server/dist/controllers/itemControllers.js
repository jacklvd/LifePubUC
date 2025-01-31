"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createItem = void 0;
const item_1 = __importDefault(require("../models/item"));
const createItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, category, condition, price, images } = req.body;
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
        const newItem = new item_1.default({
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
        yield newItem.save();
        res.status(201).json({
            message: 'Item created successfully',
            data: newItem
        });
    }
    catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({
            message: 'Error creating item', error
        });
    }
});
exports.createItem = createItem;
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
