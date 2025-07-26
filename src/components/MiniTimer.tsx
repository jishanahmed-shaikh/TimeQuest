import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAppState } from '@/contexts/AppStateContext';
import { MockTaskService, MockAuthService, Task } from '@/services/mockData';
import AudioManager from '@/utils/audioManager';
import { 
  Clock, 
  Play, 
  Pause, 
  Square, 
  Check, 
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface MiniTimerProps {
  onTaskComplete?: () => void;
}

interface ActiveTimer {
  task: Task;
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  isPaused: boolean;
}

const MiniTimer = ({ onTaskComplete }: MiniTimerProps) => {
  const { toast } = useToast();
  const { refreshUserProfile } = useAppState();
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioManager = AudioManager.getInstance();

  // No need for audio setup here, using AudioManager

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTaskTimer = (task: Task) => {
    const totalSeconds = task.duration_minutes * 60;
    setActiveTimer({
      task,
      timeLeft: totalSeconds,
      totalTime: totalSeconds,
      isRunning: true,
      isPaused: false
    });
    setIsMinimized(false);
    
    // Start timer audio
    const selectedAudio = localStorage.getItem('timequest_selected_audio') || 'simple.wav';
    const volume = localStorage.getItem('timequest_audio_volume') ? 
      parseInt(localStorage.getItem('timequest_audio_volume')!) / 100 : 0.75;
    audioManager.startTimerAudio(selectedAudio, volume);
    
    startInterval();
  };

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setActiveTimer(prev => {
        if (!prev || !prev.isRunning) return prev;
        
        if (prev.timeLeft <= 1) {
          // Timer completed
          completeTask();
          return null;
        }
        
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    audioManager.pauseTimerAudio();
    setActiveTimer(prev => prev ? { ...prev, isRunning: false, isPaused: true } : null);
  };

  const resumeTimer = () => {
    setActiveTimer(prev => prev ? { ...prev, isRunning: true, isPaused: false } : null);
    audioManager.resumeTimerAudio();
    startInterval();
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    audioManager.stopTimerAudio();
    setActiveTimer(null);
  };

  const completeTask = async () => {
    if (!activeTimer) return;

    try {
      // Stop timer audio and play completion sound
      audioManager.stopTimerAudio();
      const selectedAudio = localStorage.getItem('timequest_selected_audio') || 'simple.wav';
      const volume = localStorage.getItem('timequest_audio_volume') ? 
        parseInt(localStorage.getItem('timequest_audio_volume')!) / 100 : 0.75;
      audioManager.playOneTimeAudio(selectedAudio, volume);

      // Update task status (only if it's not the quick timer)
      if (activeTimer.task.id !== 'quick-timer') {
        await MockTaskService.updateTask(activeTimer.task.id, { 
          status: 'completed',
          completed_at: new Date().toISOString()
        });
      }

      // Calculate coins earned
      const coinsEarned = Math.floor(activeTimer.task.duration_minutes / 5) * 10;
      
      toast({
        title: "Quest Completed! 🎉",
        description: `You earned ${coinsEarned} coins for completing "${activeTimer.task.title}"!`,
      });

      // Update user coins
      const currentUser = MockAuthService.getUserProfile();
      if (currentUser) {
        await MockAuthService.updateUserProfile({
          coins: currentUser.coins + coinsEarned
        });
        await refreshUserProfile();
      }

      onTaskComplete?.();
      stopTimer();
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: "Error",
        description: "Failed to complete task",
        variant: "destructive",
      });
    }
  };

  const markAsComplete = () => {
    completeTask();
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Expose startTaskTimer globally
  useEffect(() => {
    (window as any).startTaskTimer = startTaskTimer;
    return () => {
      delete (window as any).startTaskTimer;
    };
  }, []);

  if (!activeTimer) return null;

  const progressValue = ((activeTimer.totalTime - activeTimer.timeLeft) / activeTimer.totalTime) * 100;

  if (isMinimized) {
    return (
      <div className="fixed bottom-20 md:bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="w-12 h-12 rounded-full bg-gradient-gold text-gold-foreground shadow-gold hover:shadow-glow transition-all duration-300"
        >
          <Clock className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Mini Timer Widget */}
      <Card className="fixed bottom-20 md:bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] bg-gradient-card border-gold/30 shadow-gold">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-gold animate-pulse-glow"></div>
              <span className="text-sm font-medium text-gold font-orbitron">Active Quest</span>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsExpanded(true)}
                className="w-6 h-6 p-0 text-muted-foreground hover:text-gold"
              >
                <Maximize2 className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(true)}
                className="w-6 h-6 p-0 text-muted-foreground hover:text-gold"
              >
                <Minimize2 className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={stopTimer}
                className="w-6 h-6 p-0 text-muted-foreground hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-card-foreground font-inter truncate">
                {activeTimer.task.title}
              </h4>
              <div className="text-2xl font-mono font-bold text-gold text-center my-2">
                {formatTime(activeTimer.timeLeft)}
              </div>
            </div>

            <Progress value={progressValue} className="h-2 bg-secondary" />

            <div className="flex gap-2 justify-center">
              {activeTimer.isRunning ? (
                <Button
                  size="sm"
                  onClick={pauseTimer}
                  variant="outline"
                  className="border-warning text-warning hover:bg-warning hover:text-warning-foreground"
                >
                  <Pause className="w-3 h-3 mr-1" />
                  Pause
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={resumeTimer}
                  className="bg-gradient-success text-success-foreground shadow-success"
                >
                  <Play className="w-3 h-3 mr-1" />
                  Resume
                </Button>
              )}
              
              <Button
                size="sm"
                onClick={markAsComplete}
                className="bg-gradient-gold text-gold-foreground shadow-gold"
              >
                <Check className="w-3 h-3 mr-1" />
                Complete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expanded Timer Dialog */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="sm:max-w-[400px] bg-gradient-card border-border shadow-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gold font-orbitron">
              <Clock className="w-5 h-5" />
              {activeTimer.task.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 text-center">
            <div className="text-6xl font-mono font-bold text-gold animate-glow-pulse">
              {formatTime(activeTimer.timeLeft)}
            </div>

            <div className="space-y-2">
              <Progress value={progressValue} className="h-3 bg-secondary" />
              <div className="text-xs text-muted-foreground font-inter">
                {Math.round(progressValue)}% Complete
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              {activeTimer.isRunning ? (
                <Button
                  onClick={pauseTimer}
                  variant="outline"
                  className="border-warning text-warning hover:bg-warning hover:text-warning-foreground"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button
                  onClick={resumeTimer}
                  className="bg-gradient-success text-success-foreground shadow-success"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              )}
              
              <Button
                onClick={stopTimer}
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>

              <Button
                onClick={markAsComplete}
                className="bg-gradient-gold text-gold-foreground shadow-gold"
              >
                <Check className="w-4 h-4 mr-2" />
                Complete
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1 font-inter">
              <div>Duration: {activeTimer.task.duration_minutes} minutes</div>
              <div>Status: {activeTimer.isRunning ? 'Running' : activeTimer.isPaused ? 'Paused' : 'Stopped'}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MiniTimer;