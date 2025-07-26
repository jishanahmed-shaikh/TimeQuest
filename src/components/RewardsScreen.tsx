import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MockAuthService } from '@/services/mockData';
import { Trophy, Coins, Star, Lock, Crown, Flame, Target, Zap, Gift, ShoppingCart, Award } from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  description: string;
  coinCost: number;
  icon: React.ReactNode;
  unlocked: boolean;
  category: 'badge' | 'perk' | 'cosmetic';
}

interface UserStats {
  coins: number;
  level: number;
  totalTasksCompleted: number;
  currentStreak: number;
}

const RewardsScreen = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('shop');
  const [userStats, setUserStats] = useState<UserStats>({
    coins: 0,
    level: 1,
    totalTasksCompleted: 0,
    currentStreak: 0
  });
  const [userRewards, setUserRewards] = useState<string[]>([]);

  const rewards: Reward[] = [
    // Badges (achievements)
    {
      id: 'first_quest',
      name: 'First Quest',
      description: 'Complete your first task',
      coinCost: 0,
      icon: <Target className="w-6 h-6" />,
      unlocked: false,
      category: 'badge'
    },
    {
      id: 'streak_master',
      name: 'Streak Master',
      description: 'Maintain a 7-day streak',
      coinCost: 0,
      icon: <Flame className="w-6 h-6" />,
      unlocked: false,
      category: 'badge'
    },
    {
      id: 'focus_champion',
      name: 'Focus Champion',
      description: 'Complete 10 focus sessions',
      coinCost: 0,
      icon: <Zap className="w-6 h-6" />,
      unlocked: false,
      category: 'badge'
    },
    {
      id: 'quest_warrior',
      name: 'Quest Warrior',
      description: 'Complete 50 tasks',
      coinCost: 0,
      icon: <Trophy className="w-6 h-6" />,
      unlocked: false,
      category: 'badge'
    },
    // Perks (upgradable features)
    {
      id: 'double_coins',
      name: 'Double Coins',
      description: '2x coin rewards for next 5 tasks',
      coinCost: 100,
      icon: <Coins className="w-6 h-6" />,
      unlocked: false,
      category: 'perk'
    },
    {
      id: 'streak_protection',
      name: 'Streak Shield',
      description: 'Protect your streak for 1 day',
      coinCost: 150,
      icon: <Star className="w-6 h-6" />,
      unlocked: false,
      category: 'perk'
    },
    // Cosmetics
    {
      id: 'golden_crown',
      name: 'Golden Crown',
      description: 'Exclusive profile decoration',
      coinCost: 500,
      icon: <Crown className="w-6 h-6" />,
      unlocked: false,
      category: 'cosmetic'
    },
    {
      id: 'legendary_badge',
      name: 'Legendary Status',
      description: 'Unlock legendary profile theme',
      coinCost: 1000,
      icon: <Star className="w-6 h-6" />,
      unlocked: false,
      category: 'cosmetic'
    }
  ];

  useEffect(() => {
    if (user && isOpen) {
      fetchUserData();
    }
  }, [user, isOpen]);

  const fetchUserData = async () => {
    try {
      const profile = MockAuthService.getUserProfile();
      if (profile) {
        setUserStats({
          coins: profile.coins || 0,
          level: profile.level || 1,
          totalTasksCompleted: 45, // Mock data
          currentStreak: profile.streak_count || 0
        });
      }

      // Simulate earned rewards based on achievements
      const earned = [];
      if (profile?.coins && profile.coins > 0) earned.push('first_quest');
      if (profile?.streak_count && profile.streak_count >= 7) earned.push('streak_master');
      if (profile?.level && profile.level >= 5) earned.push('focus_champion');
      
      setUserRewards(earned);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const getRewardProgress = (reward: Reward) => {
    switch (reward.id) {
      case 'first_quest':
        return { current: Math.min(userStats.totalTasksCompleted, 1), max: 1 };
      case 'streak_master':
        return { current: Math.min(userStats.currentStreak, 7), max: 7 };
      case 'focus_champion':
        return { current: Math.min(userStats.totalTasksCompleted * 0.5, 10), max: 10 }; // Estimate
      case 'quest_warrior':
        return { current: Math.min(userStats.totalTasksCompleted, 50), max: 50 };
      default:
        return null;
    }
  };

  const canAfford = (reward: Reward) => {
    return userStats.coins >= reward.coinCost;
  };

  const isUnlocked = (reward: Reward) => {
    if (reward.category === 'badge') {
      const progress = getRewardProgress(reward);
      return progress ? progress.current >= progress.max : false;
    }
    return userRewards.includes(reward.id);
  };

  const purchaseReward = async (reward: Reward) => {
    if (!canAfford(reward)) {
      toast({
        title: "Insufficient Coins",
        description: `You need ${reward.coinCost - userStats.coins} more coins to purchase this item.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const currentUser = MockAuthService.getUserProfile();
      if (currentUser) {
        await MockAuthService.updateUserProfile({
          coins: currentUser.coins - reward.coinCost
        });

        setUserRewards(prev => [...prev, reward.id]);
        setUserStats(prev => ({ ...prev, coins: prev.coins - reward.coinCost }));

        toast({
          title: "Purchase Successful! 🎉",
          description: `You've purchased ${reward.name}!`,
        });
      }
    } catch (error) {
      console.error('Error purchasing reward:', error);
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase.",
        variant: "destructive",
      });
    }
  };

  const categorizedRewards = {
    badge: rewards.filter(r => r.category === 'badge'),
    perk: rewards.filter(r => r.category === 'perk'),
    cosmetic: rewards.filter(r => r.category === 'cosmetic')
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          size="xl" 
          className="flex items-center gap-3 h-20 border-success text-success hover:bg-success hover:text-success-foreground shadow-success hover:shadow-success transition-all duration-300 font-orbitron"
        >
          <Trophy className="w-6 h-6" />
          <div className="text-left">
            <div className="font-bold">View Rewards</div>
            <div className="text-sm opacity-80">Shop & achievements</div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-gradient-card border-border shadow-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gold font-orbitron">
            <Trophy className="w-5 h-5" />
            Rewards Center
          </DialogTitle>
        </DialogHeader>

        {/* User Stats Header */}
        <Card className="bg-gradient-primary text-primary-foreground shadow-gold">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold font-orbitron">{userStats.coins.toLocaleString()}</div>
                <div className="text-xs opacity-80 font-inter">Coins</div>
              </div>
              <div>
                <div className="text-lg font-bold font-orbitron">Level {userStats.level}</div>
                <div className="text-xs opacity-80 font-inter">Current Level</div>
              </div>
              <div>
                <div className="text-lg font-bold font-orbitron">{userStats.totalTasksCompleted}</div>
                <div className="text-xs opacity-80 font-inter">Tasks Done</div>
              </div>
              <div>
                <div className="text-lg font-bold font-orbitron">{userStats.currentStreak}</div>
                <div className="text-xs opacity-80 font-inter">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-secondary">
            <TabsTrigger value="shop" className="font-orbitron">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Shop
            </TabsTrigger>
            <TabsTrigger value="achievements" className="font-orbitron">
              <Award className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="inventory" className="font-orbitron">
              <Gift className="w-4 h-4 mr-2" />
              Inventory
            </TabsTrigger>
          </TabsList>

          {/* Shop Tab */}
          <TabsContent value="shop" className="space-y-6">
            {/* Perks */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gold font-orbitron">⚡ Power-ups</h3>
              <div className="grid gap-3">
                {categorizedRewards.perk.map(reward => {
                  const affordable = canAfford(reward);
                  const owned = isUnlocked(reward);
                  
                  return (
                    <Card key={reward.id} className="bg-gradient-card border-border hover-glow hover-lift">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className={`p-2 rounded-full ${affordable ? 'bg-gradient-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                          {reward.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-card-foreground font-inter">{reward.name}</h4>
                            <Badge variant="outline" className="border-gold text-gold">
                              {reward.coinCost.toLocaleString()} coins
                            </Badge>
                            {owned && <Badge className="bg-success text-success-foreground">Owned</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground font-inter">{reward.description}</p>
                        </div>
                        <Button
                          size="sm"
                          disabled={!affordable || owned}
                          onClick={() => purchaseReward(reward)}
                          className={affordable && !owned ? 'bg-gradient-primary text-primary-foreground' : ''}
                        >
                          {owned ? 'Owned' : affordable ? 'Buy' : 'Not enough coins'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Cosmetics */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gold font-orbitron">✨ Cosmetics</h3>
              <div className="grid gap-3">
                {categorizedRewards.cosmetic.map(reward => {
                  const affordable = canAfford(reward);
                  const owned = isUnlocked(reward);
                  
                  return (
                    <Card key={reward.id} className="bg-gradient-card border-border hover-glow hover-lift">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className={`p-2 rounded-full ${affordable ? 'bg-gradient-gold text-gold-foreground' : 'bg-muted text-muted-foreground'}`}>
                          {reward.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-card-foreground font-inter">{reward.name}</h4>
                            <Badge variant="outline" className="border-gold text-gold">
                              {reward.coinCost.toLocaleString()} coins
                            </Badge>
                            {owned && <Badge className="bg-gold text-gold-foreground">Owned</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground font-inter">{reward.description}</p>
                        </div>
                        <Button
                          size="sm"
                          disabled={!affordable || owned}
                          onClick={() => purchaseReward(reward)}
                          className={affordable && !owned ? 'bg-gradient-gold text-gold-foreground' : ''}
                        >
                          {owned ? 'Owned' : affordable ? 'Buy' : 'Not enough coins'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <div className="grid gap-3">
              {categorizedRewards.badge.map(reward => {
                const progress = getRewardProgress(reward);
                const unlocked = isUnlocked(reward);
                
                return (
                  <Card key={reward.id} className={`bg-gradient-card border-border hover-glow hover-lift ${unlocked ? 'ring-2 ring-gold' : ''}`}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`p-2 rounded-full ${unlocked ? 'bg-gradient-gold text-gold-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {unlocked ? reward.icon : <Lock className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-card-foreground font-inter">{reward.name}</h4>
                          {unlocked && <Badge className="bg-gold text-gold-foreground">Unlocked</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground font-inter">{reward.description}</p>
                        {progress && !unlocked && (
                          <div className="mt-2">
                            <Progress value={(progress.current / progress.max) * 100} className="h-2" />
                            <div className="text-xs text-muted-foreground mt-1 font-inter">
                              {progress.current}/{progress.max}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-4">
            <div className="text-center py-8">
              <Gift className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold text-card-foreground font-orbitron mb-2">
                Your Inventory
              </h3>
              <p className="text-muted-foreground font-inter mb-4">
                Items you've purchased will appear here
              </p>
              {userRewards.length > 0 ? (
                <div className="grid gap-3 max-w-md mx-auto">
                  {userRewards.map(rewardId => {
                    const reward = rewards.find(r => r.id === rewardId);
                    if (!reward) return null;
                    
                    return (
                      <Card key={reward.id} className="bg-gradient-card border-gold/30">
                        <CardContent className="p-3 flex items-center gap-3">
                          <div className="p-2 rounded-full bg-gradient-gold text-gold-foreground">
                            {reward.icon}
                          </div>
                          <div className="flex-1 text-left">
                            <h4 className="font-medium text-card-foreground font-inter">
                              {reward.name}
                            </h4>
                            <p className="text-xs text-muted-foreground font-inter">
                              {reward.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground font-inter">
                  No items in your inventory yet. Visit the shop to purchase rewards!
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>


      </DialogContent>
    </Dialog>
  );
};

export default RewardsScreen;