import mongoose, { Schema, Document } from 'mongoose'

export interface IAgendaItem {
  id: string
  title: string
  description?: string
  host?: string
  startTime: string
  endTime: string
}

export interface IEventFAQ {
  question: string
  answer: string
}

export interface IEventHighlights {
  ageRestriction?: string // 'all', 'restricted', or 'guardian'
  doorTime?: string // format: '30 Minutes' or '2 Hours'
  parkingInfo?: string // 'free', 'paid', or 'none'
}

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId
  email: string
  title: string
  summary: string
  description?: string
  media?: string // URL for image or video
  mediaType: 'image' | 'video'
  location: string
  date: Date
  startTime: string
  endTime: string
  agenda?: IAgendaItem[]
  highlights?: IEventHighlights
  faqs?: IEventFAQ[]
  createdAt?: Date
  updatedAt?: Date
}

const eventSchema = new Schema<IEvent>({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  email: { type: String, required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  description: { type: String },
  media: { type: String },
  mediaType: { type: String, enum: ['image', 'video'], required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  agenda: [
    {
      id: { type: String, required: true },
      title: { type: String, required: true },
      items: [
        {
          id: { type: String, required: true },
          title: { type: String, required: true },
          description: { type: String, default: '' },
          host: { type: String, default: '' },
          startTime: { type: String },
          endTime: { type: String },
        },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const Event = mongoose.model<IEvent>('Event', eventSchema)
export default Event
