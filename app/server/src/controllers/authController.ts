import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS, FRONTEND_URL, JWT_SECRET } from "../../config/env";

import User from "../models/userSchema";

// console.log("EMAIL_USER:", EMAIL_USER);
// console.log("EMAIL_PASS:", EMAIL_PASS ? "Loaded" : "Not Loaded");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS, 
    },
  });

export const verifyEmail = async (req: any, res: any) => {
    try {
        const { emailToken } = req.body;
        // console.log("Received token:", emailToken);
        // Check if token is provided
        if (!emailToken) {
            return res.status(400).json({ message: "Token is required" });
        }

        // Find the user with the token
        const user = await User.findOne({ verificationToken: emailToken });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Mark the user as verified
        await User.updateOne({ verificationToken: emailToken }, { $set: { isVerified: true, verificationToken: null } });

        res.status(200).json({ message: "Email verified successfully. You can now sign in." });
    } catch (error: any) {
        console.error("Error verifying email:", error);
        res.status(500).json({
            message: "Error verifying email",
            error: error.message,
        });
    }
};


export const signUp = async (req: any, res: any) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { fullName, email, password, universityId } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        // Generate a verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");
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
                    isVerified: false,
                    verificationToken,
                },
            ],
            { session }
        );
        // const token = jwt.sign({userId: newUser[0]._id}, process.env.JWT_SECRET as string, { 
        //     expiresIn: "1h",
        // });
        // await session.commitTransaction();
        // session.endSession();
        // res.status(201).json({
        //     message: "User created successfully",
        //     data: {
        //         user: newUser[0],
        //         token,
        //     },
        // });
        // Send verification email
        const verificationLink = `${FRONTEND_URL}/verify-credential?emailToken=${verificationToken}`;
        await transporter.sendMail({
            from: EMAIL_USER,
            to: email,
            subject: "Verify Your Email",
            html: `<p>Please click the link below to verify your email:</p><a href="${verificationLink}">${verificationLink}</a>`,
        });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "User created successfully. Please check your email to verify your account.",
        });
    } catch (error:any) {
        console.log(error);
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({
            message: "Error creating user",
            error: error.message,
        });

        return 
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
        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: "Email not verified. Please check your email." });
        }
        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Generate a token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET as string, {
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