import mongoose from 'mongoose'
import Event from '../models/eventSchema'

export const createEvent = async (req: any, res: any) => {
  try {
    // console.log('🔍 Received event data:', JSON.stringify(req.body, null, 2));

    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: 'Request body is empty or invalid' })
    }

    const eventData = req.body

    // if (!eventData.agenda || eventData.agenda.length === 0) {
    //   console.warn('⚠️ Agenda is missing in the request!');
    // } else {
    //   console.log('✅ Agenda received:', JSON.stringify(eventData.agenda, null, 2));
    // }

    const newEvent = new Event({
      _id: new mongoose.Types.ObjectId(),
      ...eventData,
      agenda: eventData.agenda.map((agenda: { items: any[] }) => ({
        ...agenda,
        items: agenda.items.map(
          (item: {
            description: any
            host: any
            startTime: any
            endTime: any
          }) => ({
            ...item,
            description: item.description || '',
            host: item.host || '',
            startTime: item.startTime || '',
            endTime: item.endTime || '',
          }),
        ),
      })),
      createdAt: new Date(),
    })

    await newEvent.save()

    return res.status(201).json({
      message: '✅ Event created successfully',
      event: newEvent,
    })
  } catch (error) {
    console.error('❌ Server error creating event:', error)

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(error.errors).map((e) => e.message),
      })
    }

    return res.status(500).json({
      message: 'Error creating event',
      error: (error as Error).message,
    })
  }
}
