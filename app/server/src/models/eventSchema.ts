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

export interface ITicket {
  id: string
  name: string
  sold: number
  capacity: number
  type: 'Free' | 'Paid' | 'Donation'
  price?: number
  saleStart: Date
  saleEnd: Date
  startTime: string
  endTime: string
  minPerOrder?: number
  maxPerOrder?: number
}

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId
  eventId: string
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
  tickets?: ITicket[]
  totalCapacity?: number
  status?: 'draft' | 'on sale' | 'cancelled'
  publishedAt?: Date
  publishedBy?: mongoose.Types.ObjectId
  timestamps?: boolean
}

const eventSchema = new Schema<IEvent>({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  eventId: { type: String, required: true },
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
  highlights: {
    ageRestriction: { type: String },
    doorTime: { type: String },
    parkingInfo: { type: String },
    _id: false,
  },
  faqs: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
      _id: false,
    },
  ],
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
          _id: false,
        },
      ],
      _id: false,
    },
  ],
  tickets: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      sold: { type: Number, default: 0 },
      capacity: { type: Number, required: true },
      type: { type: String, enum: ['Free', 'Paid', 'Donation'], required: true },
      price: { type: Number },
      saleStart: { type: Date, required: true },
      saleEnd: { type: Date, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      minPerOrder: { type: Number, default: 1 },
      maxPerOrder: { type: Number, default: 10 },
      _id: false,
    },
  ],
  totalCapacity: { type: Number },
  status: {
    type: String,
    enum: ['draft', 'on sale', 'cancelled'],
    default: 'draft'
  },
  publishedAt: {
    type: Date,
    default: null
  },
  
  // Optional: Add more metadata about publication if needed
  publishedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true,
});

const Event = mongoose.model<IEvent>('Event', eventSchema)
export default Event