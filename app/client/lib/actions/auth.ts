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

    // // Return the URL if next-auth provides one
    // return { 
    //   success: true,
    //   url: result?.url 
    // };
    return { success: true };
  } catch (error) {
    console.error("Signin error:", error);
    return { success: false, error: "Signin error" };
  }
};

export const signUp = async (params: AuthCredentials) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
  
    if (!response.ok) {
      const errorResponse = await response.json();
      return { success: false, error: errorResponse.message };
    }
  
    const data = await response.json();
  
    if (!data?.data) {
      return { success: false, error: "Unexpected response format" };
    }
  
    const { user, token } = data.data;
    if (!user || !token) {
      return { success: false, error: "User data or token is missing" };
    }

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "Signup failed. Please try again." };
  }
};