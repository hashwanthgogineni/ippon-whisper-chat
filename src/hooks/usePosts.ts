import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  arrayUnion, 
  arrayRemove, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Post } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // 🔹 Fetch posts
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

  // 🔹 Create new post
  const createPost = async (content: string, imageUrl?: string) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'posts'), {
        userId: user.uid,
        userName: 'Whisperer',
        userEmail: 'anonymous@user.com',
        content,
        imageUrl: imageUrl || null, // ✅ store direct URL
        timestamp: serverTimestamp(),
        likes: [],
        likeCount: 0,
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

  // 🔹 Toggle like
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

  // 🔹 Add comment
  const addComment = async (postId: string, content: string) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'posts', postId, 'comments'), {
        postId,
        userId: user.uid,
        userName: 'Whisperer',
        userEmail: 'anonymous@user.com',
        content,
        timestamp: serverTimestamp(),
      });

      const post = posts.find(p => p.id === postId);
      if (post) {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          commentCount: (post.commentCount || 0) + 1,
        });
      }

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
