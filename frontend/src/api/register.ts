"use server";

import { revalidatePath } from "next/cache";

interface UserData {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  location: string;
  causes: string[];
  skills: string[];
  groups: string[];
}

export async function registerUser(userData: UserData) {
  console.log("formData", userData);
  try {
    const response = await fetch("http://127.0.0.1:8000/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: userData.username,
        password: userData.password,
        location: userData.location,
        causes: userData.causes,
        skills: userData.skills,
        groups: userData.groups,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to register user");
    }

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }

    revalidatePath("/register");
    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Failed to register user. Please try again." };
  }
}
