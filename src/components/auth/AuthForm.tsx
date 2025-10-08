import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { Chrome } from 'lucide-react';
import whisperLogo from '/whisper_logo.png';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onToggleMode: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const { theme } = useTheme();
  const { toast } = useToast();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
      } else {
        await signUpWithEmail(email, password);
        toast({
          title: "Account created!",
          description: "Welcome to Whisper.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Welcome!",
        description: "You've successfully signed in with Google.",
      });
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">

      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center pb-1">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <img 
                src={whisperLogo} 
                alt="Whisper Logo" 
                className="h-16 w-auto object-contain"
              />
            </div>
          </div>
          <CardDescription className="text-muted-foreground">
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-12 pb-12">
          <form onSubmit={handleEmailAuth} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus-ring h-11 px-4 bg-background border-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="focus-ring h-11 px-4 bg-background border-input"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 text-base font-medium" 
              disabled={loading}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground font-medium">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full h-11 text-base font-medium border-input hover:bg-accent"
          >
            <Chrome className="mr-3 h-5 w-5" />
            Continue with Google
          </Button>

          <div className="text-center text-sm pt-4">
            <span className="text-muted-foreground">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            </span>
            <Button
              variant="link"
              onClick={onToggleMode}
              className="ml-2 p-0 h-auto text-primary hover:text-primary-hover font-medium"
            >
              {mode === 'login' ? 'Sign up here' : 'Sign in here'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};