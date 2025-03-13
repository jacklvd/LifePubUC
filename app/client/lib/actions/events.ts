/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import axios from 'axios';
import { API_BASE_URL } from '@/constants';

export const createEvent = async (eventData: any) => {
    try {
      // Log request data for debugging
      console.log('Sending event data:', eventData);
      
      // Add headers for content type
      const response = await axios.post(`${API_BASE_URL}/api/events/create-event`, eventData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Log response for debugging
      console.log('API response:', response.status, response.data);
      
      if (response.status !== 201) {
        throw new Error(`Failed to create event. Status: ${response.status}`);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error creating event:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        throw new Error(error.response.data?.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        throw new Error('No response received from server. Check your network connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request error:', error.message);
        throw new Error(`Request error: ${error.message}`);
      }
    }
  };