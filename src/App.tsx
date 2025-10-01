import React, { Suspense, lazy, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import { Bot } from "lucide-react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));
const WhisperBot = lazy(() => import("@/components/WhisperBot").then(m => ({ default: m.WhisperBot })));

const queryClient = new QueryClient();

const App = () => {
  const [showBot, setShowBot] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-screen bg-background">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading...</p>
                    </div>
                  </div>
                }
              >
                <Routes>
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Navigate to="/dashboard" replace />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/auth"
                    element={
                      <PublicRoute>
                        <Auth />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>

              {/* 👇 Floating Bot Window */}
              {showBot && (
                <Suspense fallback={null}>
                  <WhisperBot onClose={() => setShowBot(false)} />
                </Suspense>
              )}

              {/* 👇 Floating Toggle Button */}
              <button
                onClick={() => setShowBot((prev) => !prev)}
                className="fixed bottom-5 right-5 bg-primary text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg hover:scale-110 transition"
                aria-label="Toggle WhisperBot"
              >
                <Bot className="h-6 w-6" />
              </button>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
