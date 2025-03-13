import mongoose from 'mongoose';
import Event from '../models/eventSchema';

export const createEvent = async (req: any, res: any) => {
    try {
        // Log incoming request body for debugging
        console.log('Received event data:', req.body);
        
        if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ message: 'Request body is empty or invalid' });
        }
        
        const eventData = req.body;
        
        // Create a new event with a generated ID
        const newEvent = new Event({ 
          _id: new mongoose.Types.ObjectId(), 
          ...eventData,
          createdAt: new Date()
        });
    
        // Save to database
        await newEvent.save();
        
        // Return successful response
        return res.status(201).json({ 
          message: 'Event created successfully', 
          event: newEvent 
        });
      } catch (error) {
        console.error('Server error creating event:', error);
        
        // Check for validation errors
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ 
            message: 'Validation error', 
            errors: Object.values(error.errors).map(e => e.message)
          });
        }
        
        // Return appropriate error
        return res.status(500).json({ 
          message: 'Error creating event', 
          error: (error as Error).message 
        });
      }
    };
