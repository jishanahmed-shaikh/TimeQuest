import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useAppState } from '@/contexts/AppStateContext';
import { MockTaskService, MockAuthService, Task, User } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';
import CreateTaskModal from './CreateTaskModal';
import TimerModal from './TimerModal';
import RewardsScreen from './RewardsScreen';
import { 
  Trophy, 
  Coins, 
  Flame, 
  Target, 
  Plus, 
  Play, 
  Clock,
  Star,
  Calendar,
  Users,
  Award,
  Check,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { userProfile, refreshUserProfile } = useAppState();
  const { toast } = useToast();
  const [profile, setProfile] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchTasks();
      refreshUserProfile();
    }
  }, [user]);

  // Separate effect for refreshUserProfile to avoid dependency issues
  useEffect(() => {
    if (user) {
      refreshUserProfile();
    }
  }, [user, refreshUserProfile]);

  // Update profile when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setProfile(userProfile);
    }
  }, [userProfile]);

  const fetchUserProfile = async () => {
    try {
      const userProfile = MockAuthService.getUserProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data, error } = await MockTaskService.getTasks();
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const handleTaskStatusUpdate = async (taskId: string, newStatus: 'in_progress' | 'completed') => {
    try {
      const { data, error } = await MockTaskService.updateTask(taskId, { 
        status: newStatus,
        completed_at: newStatus === 'completed' ? new Date().toISOString() : null
      });

      if (error) throw error;

      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, completed_at: newStatus === 'completed' ? new Date().toISOString() : null }
          : task
      ));

      toast({
        title: newStatus === 'completed' ? "Quest Completed!" : "Quest Started",
        description: newStatus === 'completed' ? "You earned coins for completing this quest!" : "Your quest is now in progress.",
      });

      if (newStatus === 'completed') {
        // Refresh profile to show updated coins
        await refreshUserProfile();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const handleTimerComplete = async (minutes: number) => {
    // Update focus time and potentially award coins
    toast({
      title: "Focus Session Complete!",
      description: `You completed ${minutes} minutes of focused work!`,
    });
    await refreshUserProfile(); // Refresh to show any rewards
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin">
          <Trophy className="w-8 h-8 text-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-textured-retro p-4 space-y-6 font-inter scan-lines">
      {/* Header with Logo */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-4">
          <img 
            src="/logotr.png" 
            alt="TimeQuest Logo" 
            className="w-10 h-10 md:w-12 md:h-12 object-contain animate-glow-pulse"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div>
            <h1 className="text-2xl md:text-4xl font-orbitron text-retro-glow animate-shimmer">Welcome back, {profile?.name || user?.email?.split('@')[0]}!</h1>
            <p className="text-muted-foreground font-inter">Ready to conquer your productivity quest?</p>
          </div>
        </div>
        <Button onClick={handleSignOut} className="neon-border hover-glow text-muted-foreground hover:text-foreground font-orbitron self-start md:self-auto">
          Sign Out
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="retro-card neon-border hover-glow hover-lift">
          <CardContent className="flex items-center p-6">
            <div className="gold-metallic p-3 rounded-full shadow-gold mr-4 animate-pulse-glow">
              <Coins className="w-6 h-6 text-gold-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground font-inter">Coins</p>
              <p className="text-2xl font-bold text-retro-glow font-orbitron">{profile?.coins || 1250}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="retro-card neon-border hover-glow hover-lift">
          <CardContent className="flex items-center p-6">
            <div className="bg-gradient-success p-3 rounded-full shadow-success mr-4 animate-pulse-glow">
              <Flame className="w-6 h-6 text-success-foreground animate-retro-flicker" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground font-inter">Streak</p>
              <p className="text-2xl font-bold text-success font-orbitron">{profile?.streak_count || 12} days</p>
            </div>
          </CardContent>
        </Card>

        <Card className="retro-card neon-border hover-glow hover-lift">
          <CardContent className="flex items-center p-6">
            <div className="bg-gradient-primary p-3 rounded-full shadow-glow mr-4 animate-pulse-glow">
              <Star className="w-6 h-6 text-primary-foreground animate-retro-flicker" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground font-inter">Level</p>
              <p className="text-2xl font-bold text-retro-glow font-orbitron">{profile?.level || 5}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="retro-card neon-border hover-glow hover-lift">
          <CardContent className="flex items-center p-6">
            <div className="bg-gradient-primary p-3 rounded-full shadow-glow mr-4 animate-pulse-glow">
              <Target className="w-6 h-6 text-primary-foreground animate-retro-flicker" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground font-inter">Tasks Today</p>
              <p className="text-2xl font-bold text-retro-glow font-orbitron">3</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CreateTaskModal onTaskCreated={fetchTasks} />
        
        <TimerModal onTimeCompleted={handleTimerComplete} />

        <RewardsScreen />
      </div>

      {/* Recent Tasks & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card className="bg-gradient-card shadow-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
              <Clock className="w-5 h-5" />
              Recent Quests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-background/20 rounded-lg border border-border/50 hover:border-gold/30 transition-all duration-300 group">
                <div className="flex-1">
                  <h4 className="font-medium text-card-foreground font-inter group-hover:text-gold transition-colors">{task.title}</h4>
                  <p className="text-sm text-muted-foreground font-inter">{task.duration_minutes} minutes</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={
                      task.status === 'completed' ? 'default' : 
                      task.status === 'in_progress' ? 'secondary' : 'outline'
                    }
                    className={
                      task.status === 'completed' ? 'bg-success text-success-foreground' :
                      task.status === 'in_progress' ? 'bg-warning text-warning-foreground' :
                      'border-border text-muted-foreground'
                    }
                  >
                    {task.status.replace('_', ' ')}
                  </Badge>
                  {task.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        handleTaskStatusUpdate(task.id, 'in_progress');
                        // Start the mini timer
                        if ((window as any).startTaskTimer) {
                          (window as any).startTaskTimer(task);
                        }
                      }}
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Start
                    </Button>
                  )}
                  {task.status === 'in_progress' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTaskStatusUpdate(task.id, 'completed')}
                      className="border-success text-success hover:bg-success hover:text-success-foreground"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {tasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="font-inter">No quests yet. Create your first mission!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress & Achievements */}
        <Card className="bg-gradient-card shadow-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
              <Award className="w-5 h-5" />
              Daily Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground font-inter">Tasks Completed</span>
                <span className="text-foreground font-medium font-orbitron">3/5</span>
              </div>
              <Progress value={60} className="h-3 bg-secondary" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground font-inter">Focus Time</span>
                <span className="text-foreground font-medium font-orbitron">120/180 min</span>
              </div>
              <Progress value={67} className="h-3 bg-secondary" />
            </div>

            <div className="pt-4 border-t border-border/50">
              <h4 className="font-medium text-gold mb-3 font-orbitron">Recent Achievements</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-gold/10 rounded-lg border border-gold/20 hover:border-gold/40 transition-all duration-300">
                  <div className="bg-gradient-gold p-2 rounded-full shadow-gold">
                    <Flame className="w-4 h-4 text-gold-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gold font-inter">7-Day Streak!</p>
                    <p className="text-xs text-muted-foreground font-inter">+50 bonus coins</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg border border-success/20 hover:border-success/40 transition-all duration-300">
                  <div className="bg-gradient-success p-2 rounded-full shadow-success">
                    <Trophy className="w-4 h-4 text-success-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-success font-inter">Focus Master</p>
                    <p className="text-xs text-muted-foreground font-inter">Complete 10 focus sessions</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add bottom padding for mobile navigation */}
      <div className="pb-20 md:pb-0"></div>
    </div>
  );
};

export default Dashboard;