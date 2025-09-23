import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Post, UserStats } from '@/types';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as Post[];

      // Calculate user statistics
      const statsMap = new Map<string, UserStats>();

      posts.forEach(post => {
        const existing = statsMap.get(post.userId) || {
          userId: post.userId,
          userName: 'Anonymous User',
          userEmail: 'anonymous@user.com',
          totalLikes: 0,
          totalPosts: 0,
          totalComments: 0,
          score: 0,
        };

        existing.totalPosts += 1;
        existing.totalLikes += post.likeCount;
        existing.totalComments += post.commentCount;
        
        // Score calculation: posts * 1 + likes * 2 + comments * 1
        existing.score = existing.totalPosts + (existing.totalLikes * 2) + existing.totalComments;

        statsMap.set(post.userId, existing);
      });

      // Sort by score descending
      const sortedStats = Array.from(statsMap.values())
        .sort((a, b) => b.score - a.score);

      setUserStats(sortedStats);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-muted';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <TrendingUp className="h-8 w-8 animate-pulse mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
          </div>
          <p className="text-muted-foreground">
            Top contributors based on posts, likes received, and engagement
          </p>
        </div>

        {userStats.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No data yet</h3>
              <p className="text-muted-foreground">
                Start posting and engaging to see the leaderboard in action!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Top 3 Podium */}
            {userStats.length >= 3 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {userStats.slice(0, 3).map((user, index) => {
                  const rank = index + 1;
                  
                  return (
                    <Card key={user.userId} className={`relative overflow-hidden ${rank === 1 ? 'md:order-2 transform md:scale-105' : rank === 2 ? 'md:order-1' : 'md:order-3'}`}>
                      <div className={`h-2 ${getRankColor(rank)}`} />
                      <CardContent className="p-6 text-center">
                        <div className="mb-4">
                          {getRankIcon(rank)}
                        </div>
                        <Avatar className="w-16 h-16 mx-auto mb-4">
                          <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                            AN
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-lg text-foreground mb-1">
                          Anonymous User #{rank}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 truncate">
                          Anonymous Contributor
                        </p>
                        <div className="flex justify-center">
                          <Badge variant="secondary" className="text-lg font-bold px-3 py-1">
                            {user.score} pts
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
                          <div>
                            <div className="font-semibold text-foreground">{user.totalPosts}</div>
                            <div className="text-muted-foreground">Posts</div>
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{user.totalLikes}</div>
                            <div className="text-muted-foreground">Likes</div>
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{user.totalComments}</div>
                            <div className="text-muted-foreground">Comments</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Remaining Users */}
            {userStats.length > 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>All Contributors</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userStats.slice(3).map((user, index) => {
                      const rank = index + 4;
                      
                      return (
                        <div key={user.userId} className="flex items-center space-x-4 p-3 rounded-lg interactive-hover">
                          <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full">
                            <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
                          </div>
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                              AN
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">Anonymous User #{rank}</h4>
                            <p className="text-sm text-muted-foreground truncate">Anonymous Contributor</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-1">
                              {user.score} pts
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {user.totalPosts}p • {user.totalLikes}l • {user.totalComments}c
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Single or Double User Display */}
            {userStats.length > 0 && userStats.length <= 3 && (
              <div className="space-y-4">
                {userStats.map((user, index) => {
                  const rank = index + 1;
                  
                  return (
                    <Card key={user.userId} className="relative overflow-hidden">
                      <div className={`h-2 ${getRankColor(rank)}`} />
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center">
                            {getRankIcon(rank)}
                          </div>
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                              AN
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-foreground">Anonymous User #{rank}</h3>
                            <p className="text-muted-foreground truncate">Anonymous Contributor</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="text-lg font-bold px-3 py-1 mb-2">
                              {user.score} pts
                            </Badge>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="font-semibold text-foreground">{user.totalPosts}</div>
                                <div className="text-muted-foreground">Posts</div>
                              </div>
                              <div>
                                <div className="font-semibold text-foreground">{user.totalLikes}</div>
                                <div className="text-muted-foreground">Likes</div>
                              </div>
                              <div>
                                <div className="font-semibold text-foreground">{user.totalComments}</div>
                                <div className="text-muted-foreground">Comments</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Leaderboard;