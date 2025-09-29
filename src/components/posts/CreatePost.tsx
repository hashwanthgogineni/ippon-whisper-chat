import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Image, X, Smile } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

interface CreatePostProps {
  onCreatePost: (content: string, imageUrl?: string) => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onCreatePost }) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && !imageUrl.trim()) {
      toast({
        title: 'Empty post',
        description: 'Please add text, emoji, or an image before posting.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await onCreatePost(content.trim() || '', imageUrl.trim() || undefined);

      setContent('');
      setImageUrl('');
      setShowImageInput(false);
      setShowEmojiPicker(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setImageUrl('');
    setShowImageInput(false);
  };

  const addEmoji = (emoji: any) => {
    setContent((prev) => prev + emoji.native);
  };

  if (!user) return null;

  const userInitials = 'W'; // Always anonymous

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
                placeholder="Share something anonymously here... 🤫"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[80px] resize-none bg-transparent shadow-none border-none text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                maxLength={500}
              />

              {showImageInput && (
                <div className="mt-3 p-3 border rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Image className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Add Image/GIF</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeImage}
                      className="ml-auto h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <input
                    type="url"
                    placeholder="Paste any image/GIF URL here..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                  />
                  {imageUrl && (
                    <div className="mt-2">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="max-w-full h-32 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          toast({
                            title: 'Invalid image URL',
                            description: 'This link does not point to a valid image/GIF.',
                            variant: 'destructive',
                          });
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {showEmojiPicker && (
                <div className="mt-3">
                  <Picker data={data} onEmojiSelect={addEmoji} theme="dark" />
                </div>
              )}

              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowImageInput(!showImageInput)}
                    className="flex items-center space-x-1"
                  >
                    <Image className="h-4 w-4" />
                    <span>Image</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="flex items-center space-x-1"
                  >
                    <Smile className="h-4 w-4" />
                    <span>Emoji</span>
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {content.length}/500
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
