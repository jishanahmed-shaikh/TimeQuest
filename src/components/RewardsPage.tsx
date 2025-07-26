import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useAppState } from '@/contexts/AppStateContext';
import { useToast } from '@/hooks/use-toast';
import { MockAuthService } from '@/services/mockData';
import { 
  Trophy, 
  Coins, 
  Star, 
  Lock, 
  Crown, 
  Flame, 
  Target, 
  Zap, 
  Gift, 
  ShoppingCart, 
  Award,
  Sparkles,
  Medal,
  Gem,
  Heart,
  Shield
} from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  description: string;
  coinCost: number;
  icon: React.ReactNode;
  unlocked: boolean;
  category: 'badge' | 'perk' | 'cosmetic' | 'premium';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserStats {
  coins: number;
  level: number;
  totalTasksCompleted: number;
  currentStreak: number;
}

const RewardsPage = () => {
  const { user } = useAuth();
  const { userProfile, refreshUserProfile } = useAppState();
  const { toast } = useToast();
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
      name: 'First Steps',
      description: 'Complete your first quest',
      coinCost: 0,
      icon: <Target className="w-6 h-6" />,
      unlocked: false,
      category: 'badge',
      rarity: 'common'
    },
    {
      id: 'streak_master',
      name: 'Streak Master',
      description: 'Maintain a 7-day streak',
      coinCost: 0,
      icon: <Flame className="w-6 h-6" />,
      unlocked: false,
      category: 'badge',
      rarity: 'rare'
    },
    {
      id: 'focus_champion',
      name: 'Focus Champion',
      description: 'Complete 10 focus sessions',
      coinCost: 0,
      icon: <Zap className="w-6 h-6" />,
      unlocked: false,
      category: 'badge',
      rarity: 'epic'
    },
    {
      id: 'quest_warrior',
      name: 'Quest Warrior',
      description: 'Complete 50 tasks',
      coinCost: 0,
      icon: <Trophy className="w-6 h-6" />,
      unlocked: false,
      category: 'badge',
      rarity: 'legendary'
    },
    // Perks (upgradable features)
    {
      id: 'double_coins',
      name: 'Double Coins',
      description: '2x coin rewards for next 5 tasks',
      coinCost: 100,
      icon: <Coins className="w-6 h-6" />,
      unlocked: false,
      category: 'perk',
      rarity: 'common'
    },
    {
      id: 'streak_protection',
      name: 'Streak Shield',
      description: 'Protect your streak for 1 day',
      coinCost: 150,
      icon: <Shield className="w-6 h-6" />,
      unlocked: false,
      category: 'perk',
      rarity: 'rare'
    },
    {
      id: 'focus_boost',
      name: 'Focus Boost',
      description: 'Extend timer by 10 minutes',
      coinCost: 75,
      icon: <Zap className="w-6 h-6" />,
      unlocked: false,
      category: 'perk',
      rarity: 'common'
    },
    // Cosmetics
    {
      id: 'golden_crown',
      name: 'Golden Crown',
      description: 'Exclusive profile decoration',
      coinCost: 500,
      icon: <Crown className="w-6 h-6" />,
      unlocked: false,
      category: 'cosmetic',
      rarity: 'epic'
    },
    {
      id: 'legendary_badge',
      name: 'Legendary Status',
      description: 'Unlock legendary profile theme',
      coinCost: 1000,
      icon: <Star className="w-6 h-6" />,
      unlocked: false,
      category: 'cosmetic',
      rarity: 'legendary'
    },
    {
      id: 'sparkle_effect',
      name: 'Sparkle Effect',
      description: 'Add sparkle animations to your profile',
      coinCost: 250,
      icon: <Sparkles className="w-6 h-6" />,
      unlocked: false,
      category: 'cosmetic',
      rarity: 'rare'
    },
    // Premium
    {
      id: 'premium_themes',
      name: 'Premium Themes',
      description: 'Unlock exclusive color themes',
      coinCost: 750,
      icon: <Gem className="w-6 h-6" />,
      unlocked: false,
      category: 'premium',
      rarity: 'epic'
    },
    {
      id: 'custom_sounds',
      name: 'Custom Sound Pack',
      description: 'Unlock premium timer sounds',
      coinCost: 300,
      icon: <Heart className="w-6 h-6" />,
      unlocked: false,
      category: 'premium',
      rarity: 'rare'
    }
  ];

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (userProfile) {
      setUserStats({
        coins: userProfile.coins || 0,
        level: userProfile.level || 1,
        totalTasksCompleted: 45, // Mock data
        currentStreak: userProfile.streak_count || 0
      });
    }
  }, [userProfile]);

  const fetchUserData = async () => {
    try {
      await refreshUserProfile();
      
      // Simulate earned rewards based on achievements
      const earned = [];
      const profile = MockAuthService.getUserProfile();
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
        return { current: Math.min(userStats.totalTasksCompleted * 0.5, 10), max: 10 };
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
        await refreshUserProfile();

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

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-muted-foreground border-muted-foreground bg-muted-foreground/10';
      case 'rare': return 'text-blue-400 border-blue-400 bg-blue-400/10';
      case 'epic': return 'text-purple-400 border-purple-400 bg-purple-400/10';
      case 'legendary': return 'text-gold border-gold bg-gold/10';
      default: return 'text-muted-foreground border-muted-foreground bg-muted-foreground/10';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'badge': return <Award className="w-4 h-4" />;
      case 'perk': return <Zap className="w-4 h-4" />;
      case 'cosmetic': return <Sparkles className="w-4 h-4" />;
      case 'premium': return <Gem className="w-4 h-4" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  const categorizedRewards = {
    badge: rewards.filter(r => r.category === 'badge'),
    perk: rewards.filter(r => r.category === 'perk'),
    cosmetic: rewards.filter(r => r.category === 'cosmetic'),
    premium: rewards.filter(r => r.category === 'premium')
  };

  return (
    <div className="min-h-screen bg-textured-retro p-4 space-y-6 font-inter scan-lines">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-orbitron text-retro-glow animate-shimmer mb-2">
          Rewards Center
        </h1>
        <p className="text-muted-foreground font-inter">
          Earn coins, unlock achievements, and customize your experience
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* User Stats Header */}
        <Card className="bg-gradient-primary text-primary-foreground shadow-gold mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center">
                <Coins className="w-8 h-8 mb-2 animate-glow-pulse" />
                <div className="text-2xl font-bold font-orbitron">{userStats.coins.toLocaleString()}</div>
                <div className="text-sm opacity-80 font-inter">Coins</div>
              </div>
              <div className="flex flex-col items-center">
                <Star className="w-8 h-8 mb-2 animate-glow-pulse" />
                <div className="text-2xl font-bold font-orbitron">Level {userStats.level}</div>
                <div className="text-sm opacity-80 font-inter">Current Level</div>
              </div>
              <div className="flex flex-col items-center">
                <Target className="w-8 h-8 mb-2 animate-glow-pulse" />
                <div className="text-2xl font-bold font-orbitron">{userStats.totalTasksCompleted}</div>
                <div className="text-sm opacity-80 font-inter">Tasks Done</div>
              </div>
              <div className="flex flex-col items-center">
                <Flame className="w-8 h-8 mb-2 animate-glow-pulse" />
                <div className="text-2xl font-bold font-orbitron">{userStats.currentStreak}</div>
                <div className="text-sm opacity-80 font-inter">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-secondary mb-6">
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
            <TabsTrigger value="premium" className="font-orbitron">
              <Gem className="w-4 h-4 mr-2" />
              Premium
            </TabsTrigger>
          </TabsList>

          {/* Shop Tab */}
          <TabsContent value="shop" className="space-y-6">
            {/* Perks */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gold font-orbitron flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Power-ups
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorizedRewards.perk.map(reward => {
                  const affordable = canAfford(reward);
                  const owned = isUnlocked(reward);
                  
                  return (
                    <Card key={reward.id} className="retro-card neon-border hover-glow hover-lift">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`p-2 rounded-full ${affordable ? 'bg-gradient-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                            {reward.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-card-foreground font-inter">{reward.name}</h4>
                              <Badge className={`text-xs ${getRarityColor(reward.rarity)} capitalize`}>
                                {reward.rarity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground font-inter mb-2">{reward.description}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="border-gold text-gold">
                                {reward.coinCost.toLocaleString()} coins
                              </Badge>
                              {owned && <Badge className="bg-success text-success-foreground">Owned</Badge>}
                            </div>
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          size="sm"
                          disabled={!affordable || owned}
                          onClick={() => purchaseReward(reward)}
                          variant={affordable && !owned ? "default" : "outline"}
                        >
                          {owned ? 'Owned' : affordable ? 'Purchase' : 'Not enough coins'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Cosmetics */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gold font-orbitron flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Cosmetics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorizedRewards.cosmetic.map(reward => {
                  const affordable = canAfford(reward);
                  const owned = isUnlocked(reward);
                  
                  return (
                    <Card key={reward.id} className="retro-card neon-border hover-glow hover-lift">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`p-2 rounded-full ${affordable ? 'bg-gradient-gold text-gold-foreground' : 'bg-muted text-muted-foreground'}`}>
                            {reward.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-card-foreground font-inter">{reward.name}</h4>
                              <Badge className={`text-xs ${getRarityColor(reward.rarity)} capitalize`}>
                                {reward.rarity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground font-inter mb-2">{reward.description}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="border-gold text-gold">
                                {reward.coinCost.toLocaleString()} coins
                              </Badge>
                              {owned && <Badge className="bg-gold text-gold-foreground">Owned</Badge>}
                            </div>
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          size="sm"
                          disabled={!affordable || owned}
                          onClick={() => purchaseReward(reward)}
                          variant={affordable && !owned ? "default" : "outline"}
                        >
                          {owned ? 'Owned' : affordable ? 'Purchase' : 'Not enough coins'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categorizedRewards.badge.map(reward => {
                const progress = getRewardProgress(reward);
                const unlocked = isUnlocked(reward);
                
                return (
                  <Card key={reward.id} className={`retro-card neon-border hover-glow hover-lift ${unlocked ? 'ring-2 ring-gold' : ''}`}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`p-3 rounded-full ${unlocked ? 'bg-gradient-gold text-gold-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {unlocked ? reward.icon : <Lock className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-card-foreground font-inter">{reward.name}</h4>
                          <Badge className={`text-xs ${getRarityColor(reward.rarity)} capitalize`}>
                            {reward.rarity}
                          </Badge>
                          {unlocked && <Badge className="bg-gold text-gold-foreground">Unlocked</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground font-inter mb-2">{reward.description}</p>
                        {progress && !unlocked && (
                          <div>
                            <Progress value={(progress.current / progress.max) * 100} className="h-2 mb-1" />
                            <div className="text-xs text-muted-foreground font-inter">
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
                Your Collection
              </h3>
              <p className="text-muted-foreground font-inter mb-6">
                Items you've purchased and achievements you've unlocked
              </p>
              {userRewards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {userRewards.map(rewardId => {
                    const reward = rewards.find(r => r.id === rewardId);
                    if (!reward) return null;
                    
                    return (
                      <Card key={reward.id} className="retro-card border-gold/30 hover-glow">
                        <CardContent className="p-4 text-center">
                          <div className="p-3 rounded-full bg-gradient-gold text-gold-foreground w-fit mx-auto mb-3">
                            {reward.icon}
                          </div>
                          <h4 className="font-medium text-card-foreground font-inter mb-1">
                            {reward.name}
                          </h4>
                          <p className="text-xs text-muted-foreground font-inter mb-2">
                            {reward.description}
                          </p>
                          <div className="flex items-center justify-center gap-2">
                            <Badge className={`text-xs ${getRarityColor(reward.rarity)} capitalize`}>
                              {reward.rarity}
                            </Badge>
                            {getCategoryIcon(reward.category)}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground font-inter">
                  No items in your collection yet. Complete achievements and visit the shop!
                </p>
              )}
            </div>
          </TabsContent>

          {/* Premium Tab */}
          <TabsContent value="premium" className="space-y-6">
            <div className="text-center mb-8">
              <Gem className="w-16 h-16 mx-auto text-gold mb-4 animate-glow-pulse" />
              <h3 className="text-2xl font-bold text-gold font-orbitron mb-2">
                Premium Collection
              </h3>
              <p className="text-muted-foreground font-inter">
                Exclusive items for the ultimate TimeQuest experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categorizedRewards.premium.map(reward => {
                const affordable = canAfford(reward);
                const owned = isUnlocked(reward);
                
                return (
                  <Card key={reward.id} className="retro-card neon-border hover-glow hover-lift bg-gradient-to-br from-purple-900/20 to-gold/20">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-3 rounded-full ${affordable ? 'bg-gradient-gold text-gold-foreground' : 'bg-muted text-muted-foreground'}`}>
                          {reward.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-bold text-card-foreground font-inter">{reward.name}</h4>
                            <Badge className={`text-xs ${getRarityColor(reward.rarity)} capitalize`}>
                              {reward.rarity}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground font-inter mb-3">{reward.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="border-gold text-gold">
                              {reward.coinCost.toLocaleString()} coins
                            </Badge>
                            {owned && <Badge className="bg-gold text-gold-foreground">Owned</Badge>}
                          </div>
                        </div>
                      </div>
                      <Button
                        className="w-full bg-gradient-gold text-gold-foreground shadow-gold hover:shadow-glow"
                        disabled={!affordable || owned}
                        onClick={() => purchaseReward(reward)}
                      >
                        {owned ? 'Owned' : affordable ? 'Purchase Premium' : 'Not enough coins'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Add bottom padding for mobile navigation */}
        <div className="pb-20 md:pb-0"></div>
      </div>
    </div>
  );
};

export default RewardsPage;