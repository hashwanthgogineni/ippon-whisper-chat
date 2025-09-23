import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CreatePost } from '@/components/posts/CreatePost';
import { PostCard } from '@/components/posts/PostCard';
import { usePosts } from '@/hooks/usePosts';
import { Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { posts, loading, createPost, toggleLike, addComment } = usePosts();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading your feed...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Whisper Wall</h1>
          <p className="text-muted-foreground">Say it loud… but stay anonymous.</p>
        </div>

        <CreatePost onCreatePost={createPost} />

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to share something anonymously with the community!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleLike={toggleLike}
                onAddComment={addComment}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;