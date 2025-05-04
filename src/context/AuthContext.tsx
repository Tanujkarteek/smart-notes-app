// client/src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
} from "../services/authService";

interface User {
  id: string;
  name: string;
  email: string;
  hasCompletedOnboarding: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  authChecked: boolean;
  hasCompletedOnboarding: boolean; // Add this
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

// Provide a default value to the context
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  authChecked: false,
  hasCompletedOnboarding: false, // Add this
  login: async () => {
    throw new Error("AuthContext not initialized");
  },
  register: async () => {
    throw new Error("AuthContext not initialized");
  },
  logout: () => {
    throw new Error("AuthContext not initialized");
  },
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setCurrentUser(null);
          setLoading(false);
          setAuthChecked(true);
          return;
        }

        const userData = await getCurrentUser();
        if (userData) {
          setCurrentUser(userData);
        } else {
          localStorage.removeItem("token");
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        localStorage.removeItem("token");
        setCurrentUser(null);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const data = await loginUser(email, password);
    localStorage.setItem("token", data.token);
    setCurrentUser(data.user);
    return data.user;
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<User> => {
    const data = await registerUser(name, email, password);
    localStorage.setItem("token", data.token);
    setCurrentUser(data.user);
    return data.user;
  };

  const logout = () => {
    logoutUser();
    localStorage.removeItem("token");
    setCurrentUser(null);
  };
  console.log("currentUser", currentUser);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        authChecked,
        hasCompletedOnboarding: currentUser
          ? !currentUser.hasCompletedOnboarding
          : true,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
