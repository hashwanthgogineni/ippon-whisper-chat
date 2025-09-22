export interface Post {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  timestamp: Date;
  likes: string[]; // Array of user IDs who liked the post
  likeCount: number;
  comments: Comment[];
  commentCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  timestamp: Date;
}

export interface UserStats {
  userId: string;
  userName: string;
  userEmail: string;
  totalLikes: number;
  totalPosts: number;
  totalComments: number;
  score: number; // Calculated score for leaderboard
}