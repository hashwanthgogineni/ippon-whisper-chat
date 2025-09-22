import React, { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

/**
 * Auth page
 * Handles login/signup toggle and renders the AuthForm.
 */
const Auth: React.FC = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <AuthForm mode={mode} onToggleMode={toggleMode} />
    </div>
  );
};

export default Auth;
