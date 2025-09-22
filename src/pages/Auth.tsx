import React, { useState } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
  };

  return <AuthForm mode={mode} onToggleMode={toggleMode} />;
};

export default Auth;