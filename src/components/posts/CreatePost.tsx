import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Send } from 'lucide-react';

interface CreatePostProps {
  onCreatePost: (content: string) => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onCreatePost }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    await onCreatePost(content.trim());
    setContent('');
    setIsSubmitting(false);
  };

  if (!user) return null;

  const userName = user.displayName || user.email?.split('@')[0] || 'Anonymous';
  const userInitials = userName.substring(0, 2).toUpperCase();

  return (
    <Card className="post-card mb-6">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start space-x-3">
            <Avatar className="flex-shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[80px] resize-none border-0 p-0 text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-muted-foreground">
                  {content.length}/500 characters
                </span>
                <Button
                  type="submit"
                  disabled={!content.trim() || isSubmitting}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};