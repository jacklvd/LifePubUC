import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/userSchema";

export const signUp = async (req: any, res: any) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { fullName, email, password, universityId } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create a new user
        const newUser = await User.create(
            [
                {
                    fullName,
                    email,
                    password: hashedPassword,
                    universityId,
                },
            ],
            { session }
        );
        const token = jwt.sign({userId: newUser[0]._id}, process.env.JWT_SECRET as string, { 
            expiresIn: "1h",
        });
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({
            message: "User created successfully",
            data: {
                user: newUser[0],
                token,
            },
        });
    } catch (error:any) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({
            message: "Error creating user",
            error: error.message,
        });
    }
}

export const signIn = async (req: any, res: any) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Generate a token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
            expiresIn: "1h",
        });
        res.status(200).json({
            message: "User signed in successfully",
            data: {
                user,
                token,
            },
        });

    } catch (error:any) {
        res.status(500).json({
            message: "Error signing in",
            error: error.message,
        });
    }
}