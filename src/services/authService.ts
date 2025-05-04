// client/src/services/authService.ts
import api from "../utils/api";

interface User {
  id: string;
  name: string;
  email: string;
  hasCompletedOnboarding: boolean;
}

interface AuthResponse {
  token: string;
  user: User;
}

// Login user
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/login", {
    email,
    password,
  });

  // Save token to localStorage for future requests
  if (response.data && response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

// Register user
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/register", {
    name,
    email,
    password,
  });

  // Save token to localStorage for future requests
  if (response.data && response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  try {
    const response = await api.get<User>("/api/auth/me");
    return response.data;
  } catch (error) {
    // If there's an error (like 401), remove the token and return null
    localStorage.removeItem("token");
    return null;
  }
};

// Logout user
export const logoutUser = (): void => {
  localStorage.removeItem("token");
  // Implement server-side token invalidation if needed
};

export const completeOnboarding = async (): Promise<User> => {
  const response = await api.put<User>("/api/auth/onboarding/complete");
  return response.data;
};
