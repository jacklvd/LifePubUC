"use server";

import User from "@/databases/schemas";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { connectToDatabase } from "@/lib/db";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
) => {
  const { email, password } = params;

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.error("Signin error:", error);
    return { success: false, error: "Signin error" };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, universityId, password } = params;

  await connectToDatabase();

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return { success: false, error: "User already exists" };
  }

  const hashedPassword = await hash(password, 10);

  try {
    // Create and save new user
    await User.create({
      fullName,
      email,
      universityId,
      password: hashedPassword,
    });

    // Automatically sign the user in after signup
    await signInWithCredentials({ email, password });

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "Signup error" };
  }
};
