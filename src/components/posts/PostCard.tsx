import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Post } from '@/types';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  onToggleLike: (postId: string, isLiked: boolean) => void;
  onAddComment: (postId: string, content: string, imageUrl?: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onToggleLike,
  onAddComment,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const { user } = useAuth();

  const isLiked = user ? post.likes.includes(user.uid) : false;
  
  // Generate consistent anonymous name based on post ID
  const generateAnonymousName = (postId: string) => {
    const names = [
      'Whisperer'
    ];
    const hash = postId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return names[Math.abs(hash) % names.length];
  };

  const anonymousName = generateAnonymousName(post.id);
  const userInitials = anonymousName.split(' ').map(word => word[0]).join('').toUpperCase();

  const handleLike = () => {
    if (user) {
      onToggleLike(post.id, isLiked);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsCommenting(true);
    await onAddComment(post.id, newComment.trim());
    setNewComment('');
    setIsCommenting(false);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <Card className="post-card mb-4">
      <CardContent className="p-4">
        {/* Post Header */}
        <div className="flex items-start space-x-3 mb-3">
          <Avatar className="flex-shrink-0">
            <AvatarFallback className="bg-muted text-muted-foreground text-sm font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col">
              <h3 className="font-semibold text-foreground leading-snug">
                {anonymousName}
              </h3>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(post.timestamp, { addSuffix: true })}
              </span>
            </div>
            {/* <p className="text-sm text-muted-foreground">
              Anonymous
            </p> */}
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-foreground whitespace-pre-wrap leading-relaxed">
            {post.content}
          </p>
          {post.imageUrl && (
            <div className="mt-3">
              <img
                src={post.imageUrl}
                alt="Post content"
                className="max-w-full rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => window.open(post.imageUrl, '_blank')}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Engagement Stats */}
        {(post.likeCount > 0 || post.commentCount > 0) && (
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <div className="flex items-center space-x-4">
              {post.likeCount > 0 && (
                <span>{post.likeCount} {post.likeCount === 1 ? 'like' : 'likes'}</span>
              )}
            </div>
            {post.commentCount > 0 && (
              <button
                onClick={toggleComments}
                className="hover:text-foreground transition-colors"
              >
                {post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}
              </button>
            )}
          </div>
        )}

        <Separator className="mb-3" />

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`like-bounce flex items-center space-x-2 ${
              isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>Like</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleComments}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Comment</span>
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 space-y-3">
            <Separator />
            
            {/* Add Comment Form */}
            {user && (
              <form onSubmit={handleComment} className="flex items-start space-x-3">
                <Avatar className="flex-shrink-0 w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    AN
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[60px] resize-none text-sm"
                    maxLength={300}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                      {newComment.length}/300
                    </span>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!newComment.trim() || isCommenting}
                      className="h-8"
                    >
                      <Send className="h-3 w-3 mr-1" />
                      {isCommenting ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <Avatar className="flex-shrink-0 w-8 h-8">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                      AN
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-sm text-foreground">
                          Anonymous User
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};