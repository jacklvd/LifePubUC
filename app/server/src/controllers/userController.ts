import { Request, Response } from 'express';
import User from '../models/userSchema';

export const getUser = async (req: Request, res: Response) => {
    try {   
        const { email, password } = req.body;
        console.log(email);
        const user = await User.findOne({ email: email });

        console.log(user);

        if (!user) {
            console.log("Here girl!");
            res.status(400).json({ message: "User does not exist" })
            return;
        }
        
        // Password handling here

        res.status(200).json({ message: "Found user", data: user });
    }
    catch (error) {
        res.status(500).json({ message: "Get user failed"});
        return;
    }
}