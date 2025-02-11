"use server";

import { signIn } from "@/auth";

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

    // Return the URL if next-auth provides one
    return { 
      success: true,
      url: result?.url 
    };
  } catch (error) {
    console.error("Signin error:", error);
    return { success: false, error: "Signin error" };
  }
};