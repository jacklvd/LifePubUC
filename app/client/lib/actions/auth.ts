"use server";

import { signIn, signOut } from "@/auth";

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


export const signOutUser = async () => {
  try {
    await signOut({ 
      redirect: false,
    
    });
    
    return { 
      success: true,
      url: "/sign-in" // or whatever URL you want to redirect to
    };
  } catch (error) {
    console.error("Signout error:", error);
    return { 
      success: false, 
      error: "Failed to sign out" 
    };
  }
};