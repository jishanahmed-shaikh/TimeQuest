import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

import { 
  User, 
  Edit, 
  Save, 
  Trophy, 
  Coins, 
  Flame, 
  Star, 
  Phone, 
  MapPin, 
  Mail,
  Calendar,
  Target,
  Award
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  coins: number;
  streak_count: number;
  level: number;
  avatar_url?: string;
  created_at: string;
}

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '8591764236',
    address: 'Mumbai, India'
  });

  // Mock user data with the provided information
  const mockUserData: UserData = {
    id: user?.id || '1',
    name: 'Jishanahmed AR Shaikh',
    email: user?.email || 'jishanahmed@example.com',
    coins: 2750,
    streak_count: 15,
    level: 7,
    created_at: '2024-01-15T00:00:00Z'
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Use mock data for now
      setUserData(mockUserData);
      setFormData(prev => ({
        ...prev,
        name: mockUserData.name
      }));
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(mockUserData);
      setFormData(prev => ({
        ...prev,
        name: mockUserData.name
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !userData) return;

    setIsLoading(true);
    try {
      // Update local data
      setUserData(prev => prev ? { ...prev, name: formData.name } : null);
      setIsEditing(false);
      
      toast({
        title: "Profile Updated!",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateLevelProgress = (level: number) => {
    const baseXP = level * 1000;
    const currentXP = userData?.coins || 0;
    const nextLevelXP = (level + 1) * 1000;
    return Math.min(((currentXP % 1000) / 1000) * 100, 100);
  };

  const achievements = [
    { id: '1', name: 'First Steps', description: 'Complete your first task', icon: Target, earned: true },
    { id: '2', name: 'Week Warrior', description: 'Maintain 7-day streak', icon: Flame, earned: true },
    { id: '3', name: 'Coin Collector', description: 'Earn 1000 coins', icon: Coins, earned: true },
    { id: '4', name: 'Focus Master', description: 'Complete 50 focus sessions', icon: Star, earned: true },
    { id: '5', name: 'Dedication', description: 'Use app for 30 days', icon: Calendar, earned: false },
    { id: '6', name: 'Legend', description: 'Reach level 10', icon: Trophy, earned: false },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin">
          <User className="w-8 h-8 text-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Profile Header */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-card p-3 rounded-full border border-gold/30">
                <User className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gold text-glow font-orbitron">User Profile</h2>
                <p className="text-sm text-muted-foreground font-inter">Manage your TimeQuest identity</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={isLoading}
              className="border-gold text-gold hover:bg-gold hover:text-gold-foreground"
            >
              {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar & Basic Info */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-card rounded-full flex items-center justify-center border-2 border-gold/30 hover:border-gold/50 transition-all duration-300">
              <User className="w-10 h-10 text-gold" />
            </div>
            <div className="flex-1 space-y-4">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="text-foreground font-inter">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-gold text-glow font-orbitron">{userData?.name}</h3>
                  <p className="text-muted-foreground font-inter">Level {userData?.level} Quest Master</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg retro-border">
              <Mail className="w-5 h-5 text-gold" />
              <div>
                <p className="text-xs text-muted-foreground font-inter">Email</p>
                <p className="text-sm font-medium text-foreground font-inter">{userData?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg retro-border">
              <Phone className="w-5 h-5 text-gold" />
              <div>
                <p className="text-xs text-muted-foreground font-inter">Phone</p>
                <p className="text-sm font-medium text-foreground font-inter">{formData.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg retro-border">
              <MapPin className="w-5 h-5 text-gold" />
              <div>
                <p className="text-xs text-muted-foreground font-inter">Location</p>
                <p className="text-sm font-medium text-foreground font-inter">{formData.address}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-texture retro-border">
          <CardContent className="flex items-center p-4">
            <div className="bg-gradient-card p-2 rounded-full border border-gold/30 mr-3">
              <Coins className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-lg font-bold text-gold font-orbitron">{userData?.coins}</p>
              <p className="text-xs text-muted-foreground font-inter">Coins</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-texture retro-border">
          <CardContent className="flex items-center p-4">
            <div className="bg-gradient-success p-2 rounded-full shadow-success mr-3">
              <Flame className="w-5 h-5 text-success-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold text-success font-orbitron">{userData?.streak_count}</p>
              <p className="text-xs text-muted-foreground font-inter">Day Streak</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-texture retro-border">
          <CardContent className="flex items-center p-4">
            <div className="bg-gradient-primary p-2 rounded-full shadow-glow mr-3">
              <Star className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold text-primary font-orbitron">{userData?.level}</p>
              <p className="text-xs text-muted-foreground font-inter">Level</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-texture retro-border">
          <CardContent className="flex items-center p-4">
            <div className="bg-gradient-card p-2 rounded-full border border-gold/30 mr-3">
              <Trophy className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-lg font-bold text-gold font-orbitron">4</p>
              <p className="text-xs text-muted-foreground font-inter">Achievements</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
            <Star className="w-5 h-5" />
            Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-inter">Level {userData?.level}</span>
              <span className="text-foreground font-orbitron">{userData?.coins} / {((userData?.level || 0) + 1) * 1000} XP</span>
            </div>
            <Progress value={calculateLevelProgress(userData?.level || 0)} className="h-3 bg-secondary" />
            <p className="text-xs text-muted-foreground text-center font-inter">
              {Math.max(0, ((userData?.level || 0) + 1) * 1000 - (userData?.coins || 0))} XP to next level
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
            <Award className="w-5 h-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                    achievement.earned
                      ? 'bg-gold/10 border-gold/30 hover:border-gold/50'
                      : 'bg-secondary/10 border-border/30 hover:border-border/50'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    achievement.earned 
                      ? 'bg-gradient-card border border-gold/30' 
                      : 'bg-secondary'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      achievement.earned 
                        ? 'text-gold' 
                        : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium font-inter ${
                      achievement.earned ? 'text-gold' : 'text-muted-foreground'
                    }`}>
                      {achievement.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-inter">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <Badge variant="default" className="bg-gold text-gold-foreground">
                      Earned
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;