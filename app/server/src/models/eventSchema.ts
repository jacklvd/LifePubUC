import mongoose, { Schema, Document } from 'mongoose';

export interface IAgendaItem {
  title: string;
  startTime: string;
  endTime: string;
}

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  title: string;
  description?: string;
  media: string; // URL for image or video
  mediaType: 'image' | 'video';
  location: string;
  date: Date;
  startTime: string;
  endTime: string;
  agenda: IAgendaItem[];
}

const eventSchema = new Schema<IEvent>({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  email: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  media: { type: String, required: true },
  mediaType: { type: String, enum: ['image', 'video'], required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  agenda: [
    {
      title: { type: String },
      startTime: { type: String },
      endTime: { type: String },
    },
  ],
});

const Event = mongoose.model<IEvent>('Event', eventSchema);
export default Event;
