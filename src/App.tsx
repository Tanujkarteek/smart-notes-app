import React, { useContext, ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

// Layout Components
import Navbar from "./components/layout/navBar";
import Footer from "./components/layout/footer";

// Auth Components
import Login from "./components/auth/login";
import Register from "./components/auth/register";

// Note Components
import NoteList from "./components/notes/notesList";
import NoteEditor from "./components/notes/notesEditor";
import OnboardingProvider from "./context/OnboardingProvider";

// Define the expected shape of context
interface User {
  name: string;
  // Add more fields if applicable
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  authChecked: boolean;
}

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser, loading, authChecked } = useContext(
    AuthContext
  ) as AuthContextType;

  if (loading || !authChecked) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">Loading...</div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Private Routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Navigate to="/dashboard" />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <NoteList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/notes/new"
                element={
                  <PrivateRoute>
                    <NoteEditor />
                  </PrivateRoute>
                }
              />
              <Route
                path="/notes/:id"
                element={
                  <PrivateRoute>
                    <NoteEditor />
                  </PrivateRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </OnboardingProvider>
    </AuthProvider>
  );
};

export default App;
