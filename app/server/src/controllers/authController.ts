import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS, FRONTEND_URL, JWT_SECRET } from "../../config/env";

import User from "../models/userSchema";

const tempUsers = new Map();

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

        // Check if token is provided
        if (!emailToken) {
            return res.status(400).json({ message: "Token is required." });
        }

        // Retrieve user data from temporary storage
        const userData = tempUsers.get(emailToken);

        if (!userData) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        // Save verified user to the database
        const newUser = new User({
            fullName: userData.fullName,
            email: userData.email,
            password: userData.password,
            universityId: userData.universityId,
            isVerified: true, // ✅ verified
        });

        await newUser.save();

        tempUsers.delete(emailToken);

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

        // Before sending email, check if user has an unverified entry
        for (let [token, userData] of tempUsers.entries()) {
            if (userData.email === email) {
                return res.status(400).json({
                    message: "A verification email has already been sent. Please check your inbox.",
                });
            }
        }

        // Generate a verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        // Hash the password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Store user data temporarily (NOT in the database)
        tempUsers.set(verificationToken, {
            fullName,
            email,
            password: hashedPassword,
            universityId,
            isVerified: false,
        });

        // Send verification email
        const verificationLink = `${FRONTEND_URL}/verify-credential?emailToken=${verificationToken}`;
        await transporter.sendMail({
            from: EMAIL_USER,
            to: email,
            subject: "🎉 Confirm Your Email - Welcome to LifePub!",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2>Hi there! 😊</h2>
                    <p>Thank you for signing up for LifePub! 🎉</p>
                    <p>To get started, please confirm your email address by clicking the link below:</p>
                    <p style="text-align: center; margin: 20px 0;">
                        <a href="${verificationLink}" 
                            style="display: inline-block; padding: 12px 20px; font-size: 16px; 
                            color: #fff; background-color: #007bff; text-decoration: none; 
                            border-radius: 5px;">
                            ✅ Verify My Email
                        </a>
                    </p>
                    <p>Or, you can copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background: #f4f4f4; padding: 10px; border-radius: 5px;">
                        <a href="${verificationLink}" style="color: #007bff;">${verificationLink}</a>
                    </p>
                    <p>If you didn't sign up for LifePub, you can safely ignore this email.</p>
                    <p>Wishing you all the best! 💙</p>
                    <p><strong>The LifePub Team 🚀</strong></p>
                </div>
            `,
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
            return res.status(400).json({ message: "Invalid email" });
        }
        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: "Email not verified. Please check your email." });
        }
        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password. Please try again." });
        }
        // Generate a token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET as string, {
            expiresIn: "1h",
        });
        res.status(200).json({
            success: true,
            message: "Signed in successfully",
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