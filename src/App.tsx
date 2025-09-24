import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
// import Leaderboard from "./pages/Leaderboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { WhisperBot } from "@/components/WhisperBot"; 
import { Bot } from "lucide-react"; // 👈 new icon

const queryClient = new QueryClient();

// Protected Route
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

// Public Route
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

const App = () => {
  const [showBot, setShowBot] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Default: redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Public Auth page */}
                <Route
                  path="/auth"
                  element={
                    <PublicRoute>
                      <Auth />
                    </PublicRoute>
                  }
                />

                {/* Protected pages */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all for 404s */}
                <Route path="*" element={<NotFound />} />
              </Routes>

              {/* 👇 Floating Bot Window */}
              {showBot && <WhisperBot onClose={() => setShowBot(false)} />}

              {/* 👇 Floating Toggle Button */}
              <button
                onClick={() => setShowBot((prev) => !prev)}
                className="fixed bottom-5 right-5 bg-primary text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg hover:scale-110 transition"
                aria-label="Toggle WhisperBot"
              >
                <Bot className="h-6 w-6" /> {/* simple robot icon */}
              </button>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
