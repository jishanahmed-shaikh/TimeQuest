import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Trophy, 
  Crown, 
  Flame, 
  Target, 
  Star,
  TrendingUp,
  Calendar,
  Award,
  Zap,
  Clock,
  Medal
} from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  level: number;
  coins: number;
  streak: number;
  tasksCompleted: number;
  avatar?: string;
  rank: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
}

interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  goal: number;
  current: number;
  participants: number;
  reward: string;
  endsAt: string;
  type: 'daily' | 'weekly' | 'monthly';
}

const SocialPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('leaderboard');

  // Mock data for demonstration
  const leaderboardData: LeaderboardUser[] = [
    {
      id: '1',
      name: 'Quest Master',
      level: 15,
      coins: 5420,
      streak: 28,
      tasksCompleted: 156,
      rank: 1
    },
    {
      id: '2',
      name: 'Focus Ninja',
      level: 12,
      coins: 4180,
      streak: 21,
      tasksCompleted: 134,
      rank: 2
    },
    {
      id: '3',
      name: 'Productivity Guru',
      level: 11,
      coins: 3890,
      streak: 19,
      tasksCompleted: 128,
      rank: 3
    },
    {
      id: '4',
      name: 'Time Warrior',
      level: 10,
      coins: 3250,
      streak: 15,
      tasksCompleted: 98,
      rank: 4
    },
    {
      id: '5',
      name: user?.name || 'You',
      level: 5,
      coins: 1250,
      streak: 12,
      tasksCompleted: 45,
      rank: 5
    }
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first quest',
      icon: <Target className="w-4 h-4" />,
      rarity: 'common',
      unlockedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Streak Master',
      description: 'Maintain a 7-day streak',
      icon: <Flame className="w-4 h-4" />,
      rarity: 'rare',
      unlockedAt: '2024-01-22'
    },
    {
      id: '3',
      name: 'Focus Champion',
      description: 'Complete 50 focus sessions',
      icon: <Zap className="w-4 h-4" />,
      rarity: 'epic',
      unlockedAt: '2024-02-01'
    },
    {
      id: '4',
      name: 'Time Lord',
      description: 'Accumulate 100 hours of focus time',
      icon: <Clock className="w-4 h-4" />,
      rarity: 'legendary',
      unlockedAt: '2024-02-15'
    }
  ];

  const challenges: CommunityChallenge[] = [
    {
      id: '1',
      title: 'Daily Focus Challenge',
      description: 'Complete at least 2 focus sessions today',
      goal: 1000,
      current: 756,
      participants: 234,
      reward: '50 bonus coins',
      endsAt: '2024-02-28T23:59:59Z',
      type: 'daily'
    },
    {
      id: '2',
      title: 'Weekly Streak Warriors',
      description: 'Maintain your streak for the entire week',
      goal: 500,
      current: 342,
      participants: 156,
      reward: 'Exclusive badge + 200 coins',
      endsAt: '2024-03-03T23:59:59Z',
      type: 'weekly'
    },
    {
      id: '3',
      title: 'Monthly Productivity Masters',
      description: 'Complete 100 tasks this month',
      goal: 10000,
      current: 6789,
      participants: 89,
      reward: 'Legendary crown + 1000 coins',
      endsAt: '2024-03-31T23:59:59Z',
      type: 'monthly'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-muted-foreground border-muted-foreground';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-gold border-gold';
      default: return 'text-muted-foreground border-muted-foreground';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-gold" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="text-muted-foreground font-orbitron">#{rank}</span>;
    }
  };

  const formatTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  return (
    <div className="min-h-screen bg-textured-retro p-4 space-y-6 font-inter scan-lines">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-orbitron text-retro-glow animate-shimmer mb-2">
          Social Hub
        </h1>
        <p className="text-muted-foreground font-inter">
          Connect with fellow Quest Masters and compete for glory
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-secondary mb-6">
            <TabsTrigger value="leaderboard" className="font-orbitron">
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="achievements" className="font-orbitron">
              <Award className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="challenges" className="font-orbitron">
              <Target className="w-4 h-4 mr-2" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="friends" className="font-orbitron">
              <Users className="w-4 h-4 mr-2" />
              Friends
            </TabsTrigger>
          </TabsList>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top 3 Podium */}
              <div className="lg:col-span-3">
                <Card className="retro-card neon-border hover-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
                      <Crown className="w-5 h-5" />
                      Hall of Fame
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {leaderboardData.slice(0, 3).map((user, index) => (
                        <div
                          key={user.id}
                          className={`text-center p-6 rounded-lg border-2 ${
                            index === 0 ? 'border-gold bg-gold/10' :
                            index === 1 ? 'border-gray-400 bg-gray-400/10' :
                            'border-amber-600 bg-amber-600/10'
                          }`}
                        >
                          <div className="flex justify-center mb-3">
                            {getRankIcon(user.rank)}
                          </div>
                          <Avatar className="w-16 h-16 mx-auto mb-3">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-gradient-gold text-gold-foreground font-orbitron">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="font-bold text-card-foreground font-orbitron mb-2">
                            {user.name}
                          </h3>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground font-inter">Level</span>
                              <span className="text-gold font-orbitron">{user.level}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground font-inter">Coins</span>
                              <span className="text-gold font-orbitron">{user.coins.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground font-inter">Streak</span>
                              <span className="text-success font-orbitron">{user.streak} days</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Full Leaderboard */}
              <div className="lg:col-span-2">
                <Card className="retro-card neon-border hover-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
                      <TrendingUp className="w-5 h-5" />
                      Global Rankings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {leaderboardData.map((user) => (
                        <div
                          key={user.id}
                          className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-300 ${
                            user.name === (user?.name || 'You') 
                              ? 'border-gold bg-gold/10 shadow-gold' 
                              : 'border-border bg-background/20 hover:border-gold/30'
                          }`}
                        >
                          <div className="flex items-center justify-center w-8">
                            {getRankIcon(user.rank)}
                          </div>
                          
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-gradient-primary text-primary-foreground font-orbitron">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-card-foreground font-inter">
                                {user.name}
                              </span>
                              <Badge variant="outline" className="text-xs border-gold text-gold">
                                Level {user.level}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground font-inter">
                              {user.tasksCompleted} quests completed
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-gold font-bold font-orbitron">
                              {user.coins.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground font-inter">
                              coins
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-success">
                            <Flame className="w-3 h-3" />
                            <span className="text-sm font-orbitron">{user.streak}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Your Stats */}
              <div>
                <Card className="retro-card neon-border hover-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
                      <Star className="w-5 h-5" />
                      Your Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gold font-orbitron mb-1">
                        #{leaderboardData.find(u => u.name === (user?.name || 'You'))?.rank}
                      </div>
                      <div className="text-sm text-muted-foreground font-inter">
                        Global Rank
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground font-inter">Next Level</span>
                          <span className="text-gold font-orbitron">Level 6</span>
                        </div>
                        <Progress value={75} className="h-2 bg-secondary" />
                        <div className="text-xs text-muted-foreground text-center mt-1 font-inter">
                          750/1000 XP
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="p-3 bg-gold/10 rounded-lg border border-gold/20">
                          <div className="text-lg font-bold text-gold font-orbitron">
                            1,250
                          </div>
                          <div className="text-xs text-muted-foreground font-inter">
                            Coins
                          </div>
                        </div>
                        <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                          <div className="text-lg font-bold text-success font-orbitron">
                            12
                          </div>
                          <div className="text-xs text-muted-foreground font-inter">
                            Day Streak
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="retro-card neon-border hover-glow hover-lift">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full border-2 ${getRarityColor(achievement.rarity)} bg-background/50`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-card-foreground font-inter">
                            {achievement.name}
                          </h3>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getRarityColor(achievement.rarity)} capitalize`}
                          >
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-inter mb-2">
                          {achievement.description}
                        </p>
                        <div className="text-xs text-muted-foreground font-inter">
                          Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="retro-card neon-border hover-glow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
                        <Target className="w-5 h-5" />
                        {challenge.title}
                      </CardTitle>
                      <Badge 
                        variant="outline" 
                        className={`${
                          challenge.type === 'daily' ? 'border-success text-success' :
                          challenge.type === 'weekly' ? 'border-warning text-warning' :
                          'border-primary text-primary'
                        } font-orbitron`}
                      >
                        {challenge.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground font-inter">
                      {challenge.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-inter">Progress</span>
                        <span className="text-gold font-orbitron">
                          {challenge.current.toLocaleString()}/{challenge.goal.toLocaleString()}
                        </span>
                      </div>
                      <Progress 
                        value={(challenge.current / challenge.goal) * 100} 
                        className="h-3 bg-secondary" 
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground font-inter">
                          {challenge.participants} participants
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground font-inter">
                          {formatTimeRemaining(challenge.endsAt)} left
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-gold/10 rounded-lg border border-gold/20">
                      <div className="text-sm font-medium text-gold font-inter">
                        🏆 Reward: {challenge.reward}
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow font-orbitron"
                    >
                      Join Challenge
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Friends Tab */}
          <TabsContent value="friends" className="space-y-6">
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold text-card-foreground font-orbitron mb-2">
                Friends Feature Coming Soon!
              </h3>
              <p className="text-muted-foreground font-inter max-w-md mx-auto">
                Connect with friends, share achievements, and compete in private challenges. 
                This feature is currently in development.
              </p>
              <Button 
                className="mt-6 bg-gradient-gold text-gold-foreground shadow-gold hover:shadow-glow font-orbitron"
                disabled
              >
                Coming Soon
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SocialPage;