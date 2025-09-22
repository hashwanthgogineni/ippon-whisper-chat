import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Post, Comment } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as Post[];
      
      setPosts(postsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const createPost = async (content: string) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'posts'), {
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        userEmail: user.email,
        content,
        timestamp: serverTimestamp(),
        likes: [],
        likeCount: 0,
        comments: [],
        commentCount: 0,
      });

      toast({
        title: "Post created!",
        description: "Your message has been shared.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleLike = async (postId: string, isLiked: boolean) => {
    if (!user) return;

    try {
      const postRef = doc(db, 'posts', postId);
      const post = posts.find(p => p.id === postId);
      
      if (!post) return;

      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid),
          likeCount: Math.max(0, post.likeCount - 1),
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid),
          likeCount: post.likeCount + 1,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) return;

    try {
      const comment: Omit<Comment, 'id'> = {
        postId,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        userEmail: user.email || '',
        content,
        timestamp: new Date(),
      };

      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: arrayUnion({
          ...comment,
          id: crypto.randomUUID(),
          timestamp: serverTimestamp(),
        }),
        commentCount: post.commentCount + 1,
      });

      toast({
        title: "Comment added!",
        description: "Your comment has been posted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    posts,
    loading,
    createPost,
    toggleLike,
    addComment,
  };
};