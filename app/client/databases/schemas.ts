import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  fullName: string;
  email: string;
  password: string;
  universityId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the User schema
const UserSchema = new mongoose.Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    universityId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);


const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
