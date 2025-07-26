import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAppState } from '@/contexts/AppStateContext';
import AudioManager from '@/utils/audioManager';
import { Play, Pause, Square, Clock, Timer } from 'lucide-react';

interface TimerModalProps {
  onTimeCompleted?: (minutes: number) => void;
}

const TimerModal = ({ onTimeCompleted }: TimerModalProps) => {
  const { toast } = useToast();
  const { refreshUserProfile } = useAppState();
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [totalTime] = useState(25 * 60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioManager = AudioManager.getInstance();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
    
    // Start timer audio
    const selectedAudio = localStorage.getItem('timequest_selected_audio') || 'simple.wav';
    const volume = localStorage.getItem('timequest_audio_volume') ? 
      parseInt(localStorage.getItem('timequest_audio_volume')!) / 100 : 0.75;
    audioManager.startTimerAudio(selectedAudio, volume);

    // Start the mini timer for quick timer
    const quickTimerTask = {
      id: 'quick-timer',
      title: 'Quick Focus Session',
      description: '25-minute Pomodoro session',
      duration_minutes: 25,
      status: 'in_progress' as const,
      created_at: new Date().toISOString(),
      user_id: 'current-user'
    };

    if ((window as any).startTaskTimer) {
      (window as any).startTaskTimer(quickTimerTask);
    }
    
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer completed
            setIsRunning(false);
            setIsPaused(false);
            audioManager.stopTimerAudio();
            
            // Play completion sound
            audioManager.playOneTimeAudio(selectedAudio, volume);
            
            onTimeCompleted?.(25);
            toast({
              title: "Focus Session Complete!",
              description: "You've completed a 25-minute focus session. Great work!",
            });
            
            // Award coins and refresh profile
            refreshUserProfile();
            
            return totalTime; // Reset timer
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    setIsOpen(false); // Close modal when timer starts
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setIsPaused(true);
    audioManager.pauseTimerAudio();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(totalTime);
    audioManager.stopTimerAudio();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    setTimeLeft(totalTime);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const progressValue = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="xl" 
          className="flex items-center gap-3 h-20 border-gold text-gold hover:bg-gold hover:text-gold-foreground shadow-gold hover:shadow-glow transition-all duration-300 font-orbitron"
        >
          <Play className="w-6 h-6" />
          <div className="text-left">
            <div className="font-bold">Quick Timer</div>
            <div className="text-sm opacity-80">25 min focus session</div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-gradient-card border-border shadow-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gold font-orbitron text-center">
            <Timer className="w-5 h-5" />
            Focus Timer
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-center">
          {/* Timer Display */}
          <div className="relative">
            <div className="text-6xl font-mono font-bold text-gold animate-glow-pulse">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-muted-foreground mt-2 font-inter">
              {isRunning ? 'Focus time active' : isPaused ? 'Paused' : 'Ready to start'}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={progressValue} 
              className="h-3 bg-secondary"
            />
            <div className="text-xs text-muted-foreground font-inter">
              {Math.round(progressValue)}% Complete
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3 justify-center">
            {!isRunning && !isPaused && (
              <Button
                onClick={startTimer}
                className="bg-gradient-success text-success-foreground shadow-success hover:shadow-success transition-all duration-300 font-orbitron"
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            )}
            
            {isRunning && (
              <Button
                onClick={pauseTimer}
                variant="outline"
                className="border-warning text-warning hover:bg-warning hover:text-warning-foreground"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            
            {isPaused && (
              <Button
                onClick={startTimer}
                className="bg-gradient-success text-success-foreground shadow-success hover:shadow-success"
              >
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
            )}
            
            {(isRunning || isPaused) && (
              <Button
                onClick={stopTimer}
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            )}
          </div>

          {/* Timer Info */}
          <div className="text-xs text-muted-foreground space-y-1 font-inter">
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" />
              Pomodoro Technique - 25 minutes of focused work
            </div>
            <div>Complete the session to earn coins and maintain your streak!</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimerModal;