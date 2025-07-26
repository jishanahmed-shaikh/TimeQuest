import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAppState } from '@/contexts/AppStateContext';
import { MockTaskService, Task } from '@/services/mockData';
import AudioManager from '@/utils/audioManager';
import { 
  Timer, 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  Clock,
  Target,
  Zap,
  Coffee,
  Brain,
  Settings,
  Volume2
} from 'lucide-react';

const TimerPage = () => {
  const { toast } = useToast();
  const { refreshUserProfile } = useAppState();
  const [activeTab, setActiveTab] = useState('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [sessionType, setSessionType] = useState<'work' | 'break' | 'longBreak'>('work');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [customTimes, setCustomTimes] = useState({ work: 30, shortBreak: 5, longBreak: 15 });
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioManager = AudioManager.getInstance();

  // Timer presets
  const presets = {
    pomodoro: { work: 25, shortBreak: 5, longBreak: 15 },
    focus: { work: 45, shortBreak: 10, longBreak: 20 },
    sprint: { work: 15, shortBreak: 3, longBreak: 10 },
    custom: customTimes
  };

  useEffect(() => {
    fetchTasks();
    // Load custom times from localStorage
    const savedCustomTimes = localStorage.getItem('timequest_custom_times');
    if (savedCustomTimes) {
      setCustomTimes(JSON.parse(savedCustomTimes));
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await MockTaskService.getTasks();
      if (data) {
        setTasks(data.filter(task => task.status === 'pending' || task.status === 'in_progress'));
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

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
    
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
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
    audioManager.stopTimerAudio();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    resetTimer();
  };

  const resetTimer = () => {
    const preset = presets[activeTab as keyof typeof presets];
    const duration = sessionType === 'work' ? preset.work : 
                    sessionType === 'break' ? preset.shortBreak : preset.longBreak;
    const seconds = duration * 60;
    setTimeLeft(seconds);
    setTotalTime(seconds);
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    setIsPaused(false);
    
    // Stop timer audio and play completion sound
    audioManager.stopTimerAudio();
    const selectedAudio = localStorage.getItem('timequest_selected_audio') || 'simple.wav';
    const volume = localStorage.getItem('timequest_audio_volume') ? 
      parseInt(localStorage.getItem('timequest_audio_volume')!) / 100 : 0.75;
    audioManager.playOneTimeAudio(selectedAudio, volume);

    if (sessionType === 'work') {
      // Complete work session
      toast({
        title: "Work Session Complete! 🎉",
        description: `Great job! You completed a ${totalTime / 60}-minute focus session.`,
      });

      // If task was selected, mark as completed or update progress
      if (selectedTask) {
        handleTaskProgress();
      }
      
      // Refresh user profile for coin updates
      refreshUserProfile();

      // Determine next session
      if (currentSession % 4 === 0) {
        setSessionType('longBreak');
        setTimeLeft(presets[activeTab as keyof typeof presets].longBreak * 60);
        setTotalTime(presets[activeTab as keyof typeof presets].longBreak * 60);
      } else {
        setSessionType('break');
        setTimeLeft(presets[activeTab as keyof typeof presets].shortBreak * 60);
        setTotalTime(presets[activeTab as keyof typeof presets].shortBreak * 60);
      }
    } else {
      // Complete break session
      toast({
        title: "Break Complete! ☕",
        description: "Time to get back to work!",
      });
      
      setSessionType('work');
      setCurrentSession(prev => prev + 1);
      resetTimer();
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleTaskProgress = async () => {
    if (!selectedTask) return;

    try {
      // For now, mark task as completed after one session
      // In a real app, you might track partial progress
      await MockTaskService.updateTask(selectedTask.id, {
        status: 'completed',
        completed_at: new Date().toISOString()
      });

      toast({
        title: "Quest Completed! 🏆",
        description: `You completed "${selectedTask.title}" and earned coins!`,
      });

      setSelectedTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const changePreset = (preset: string) => {
    setActiveTab(preset);
    setSessionType('work');
    setCurrentSession(1);
    stopTimer();
    
    const presetConfig = presets[preset as keyof typeof presets];
    const seconds = presetConfig.work * 60;
    setTimeLeft(seconds);
    setTotalTime(seconds);
  };

  const updateCustomTime = (type: 'work' | 'shortBreak' | 'longBreak', value: number) => {
    const newCustomTimes = { ...customTimes, [type]: value };
    setCustomTimes(newCustomTimes);
    localStorage.setItem('timequest_custom_times', JSON.stringify(newCustomTimes));
    
    // If we're on custom preset and updating the current session type, update the timer
    if (activeTab === 'custom') {
      if ((type === 'work' && sessionType === 'work') ||
          (type === 'shortBreak' && sessionType === 'break') ||
          (type === 'longBreak' && sessionType === 'longBreak')) {
        const seconds = value * 60;
        setTimeLeft(seconds);
        setTotalTime(seconds);
      }
    }
  };

  const testAudio = () => {
    if (isTestingAudio) {
      audioManager.stopAllAudio();
      setIsTestingAudio(false);
    } else {
      const selectedAudio = localStorage.getItem('timequest_selected_audio') || 'simple.wav';
      const volume = localStorage.getItem('timequest_audio_volume') ? 
        parseInt(localStorage.getItem('timequest_audio_volume')!) / 100 : 0.75;
      audioManager.playOneTimeAudio(selectedAudio, volume);
      setIsTestingAudio(true);
      
      // Auto-stop testing after 3 seconds
      setTimeout(() => {
        setIsTestingAudio(false);
      }, 3000);
    }
  };

  const progressValue = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-textured-retro p-4 space-y-6 font-inter scan-lines">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-orbitron text-retro-glow animate-shimmer mb-2">
          Focus Timer
        </h1>
        <p className="text-muted-foreground font-inter">
          Boost your productivity with focused work sessions
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timer Presets */}
          <Card className="retro-card neon-border hover-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
                <Timer className="w-5 h-5" />
                Timer Presets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={changePreset}>
                <TabsList className="grid w-full grid-cols-4 bg-secondary">
                  <TabsTrigger value="pomodoro" className="font-orbitron">Pomodoro</TabsTrigger>
                  <TabsTrigger value="focus" className="font-orbitron">Focus</TabsTrigger>
                  <TabsTrigger value="sprint" className="font-orbitron">Sprint</TabsTrigger>
                  <TabsTrigger value="custom" className="font-orbitron">Custom</TabsTrigger>
                </TabsList>
                
                <div className="mt-4 text-center">
                  {activeTab === 'custom' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground font-inter">Work (min)</Label>
                          <Input
                            type="number"
                            min="1"
                            max="120"
                            value={customTimes.work}
                            onChange={(e) => updateCustomTime('work', parseInt(e.target.value) || 1)}
                            className="text-center bg-input border-border text-foreground"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground font-inter">Break (min)</Label>
                          <Input
                            type="number"
                            min="1"
                            max="60"
                            value={customTimes.shortBreak}
                            onChange={(e) => updateCustomTime('shortBreak', parseInt(e.target.value) || 1)}
                            className="text-center bg-input border-border text-foreground"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground font-inter">Long Break (min)</Label>
                          <Input
                            type="number"
                            min="1"
                            max="60"
                            value={customTimes.longBreak}
                            onChange={(e) => updateCustomTime('longBreak', parseInt(e.target.value) || 1)}
                            className="text-center bg-input border-border text-foreground"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-gold font-bold font-orbitron">
                          {presets[activeTab as keyof typeof presets].work}m
                        </div>
                        <div className="text-muted-foreground font-inter">Work</div>
                      </div>
                      <div className="text-center">
                        <div className="text-success font-bold font-orbitron">
                          {presets[activeTab as keyof typeof presets].shortBreak}m
                        </div>
                        <div className="text-muted-foreground font-inter">Break</div>
                      </div>
                      <div className="text-center">
                        <div className="text-primary font-bold font-orbitron">
                          {presets[activeTab as keyof typeof presets].longBreak}m
                        </div>
                        <div className="text-muted-foreground font-inter">Long Break</div>
                      </div>
                    </div>
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* Main Timer Display */}
          <Card className="retro-card neon-border hover-glow">
            <CardContent className="p-8 text-center">
              {/* Session Info */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <Badge 
                  variant={sessionType === 'work' ? 'default' : 'secondary'}
                  className={`${sessionType === 'work' ? 'bg-gold text-gold-foreground' : 
                    sessionType === 'break' ? 'bg-success text-success-foreground' : 
                    'bg-primary text-primary-foreground'} font-orbitron`}
                >
                  {sessionType === 'work' ? (
                    <>
                      <Brain className="w-3 h-3 mr-1" />
                      Work Session
                    </>
                  ) : sessionType === 'break' ? (
                    <>
                      <Coffee className="w-3 h-3 mr-1" />
                      Short Break
                    </>
                  ) : (
                    <>
                      <Coffee className="w-3 h-3 mr-1" />
                      Long Break
                    </>
                  )}
                </Badge>
                <Badge variant="outline" className="border-gold text-gold font-orbitron">
                  Session {currentSession}
                </Badge>
              </div>

              {/* Timer Display */}
              <div className="text-8xl font-mono font-bold text-gold animate-glow-pulse mb-6">
                {formatTime(timeLeft)}
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-8">
                <Progress 
                  value={progressValue} 
                  className="h-4 bg-secondary"
                />
                <div className="text-sm text-muted-foreground font-inter">
                  {Math.round(progressValue)}% Complete
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex gap-4 justify-center">
                {!isRunning && !isPaused && (
                  <Button
                    onClick={startTimer}
                    size="lg"
                    className="bg-gradient-success text-success-foreground shadow-success hover:shadow-success transition-all duration-300 font-orbitron"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </Button>
                )}
                
                {isRunning && (
                  <Button
                    onClick={pauseTimer}
                    size="lg"
                    variant="outline"
                    className="border-warning text-warning hover:bg-warning hover:text-warning-foreground font-orbitron"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </Button>
                )}
                
                {isPaused && (
                  <Button
                    onClick={startTimer}
                    size="lg"
                    className="bg-gradient-success text-success-foreground shadow-success hover:shadow-success font-orbitron"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Resume
                  </Button>
                )}
                
                {(isRunning || isPaused) && (
                  <Button
                    onClick={stopTimer}
                    size="lg"
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground font-orbitron"
                  >
                    <Square className="w-5 h-5 mr-2" />
                    Stop
                  </Button>
                )}

                <Button
                  onClick={resetTimer}
                  size="lg"
                  variant="outline"
                  className="border-muted-foreground text-muted-foreground hover:bg-muted hover:text-muted-foreground font-orbitron"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Task Selection */}
          <Card className="retro-card neon-border hover-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
                <Target className="w-5 h-5" />
                Active Quest
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={selectedTask?.id || ''}
                onValueChange={(taskId) => {
                  const task = tasks.find(t => t.id === taskId);
                  setSelectedTask(task || null);
                }}
              >
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Select a quest to focus on" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {tasks.map(task => (
                    <SelectItem key={task.id} value={task.id}>
                      <div className="flex items-center gap-2">
                        <span className="truncate">{task.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {task.duration_minutes}m
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedTask && (
                <div className="p-3 bg-gold/10 rounded-lg border border-gold/20">
                  <h4 className="font-medium text-gold font-inter mb-1">
                    {selectedTask.title}
                  </h4>
                  <p className="text-sm text-muted-foreground font-inter">
                    {selectedTask.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-inter">
                      {selectedTask.duration_minutes} minutes
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Stats */}
          <Card className="retro-card neon-border hover-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
                <Zap className="w-5 h-5" />
                Session Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gold font-orbitron">
                    {currentSession}
                  </div>
                  <div className="text-xs text-muted-foreground font-inter">
                    Current Session
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success font-orbitron">
                    {Math.floor(currentSession / 4)}
                  </div>
                  <div className="text-xs text-muted-foreground font-inter">
                    Cycles Complete
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-inter">Next Break</span>
                  <span className="text-foreground font-orbitron">
                    {currentSession % 4 === 0 ? 'Long' : 'Short'} Break
                  </span>
                </div>
                <Progress 
                  value={(currentSession % 4) * 25} 
                  className="h-2 bg-secondary" 
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Settings */}
          <Card className="retro-card neon-border hover-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
                <Settings className="w-5 h-5" />
                Quick Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-inter">Sound Effects</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={testAudio}
                  className={`text-xs font-orbitron ${isTestingAudio ? 'bg-destructive text-destructive-foreground' : ''}`}
                >
                  {isTestingAudio ? 'Stop' : 'Test'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TimerPage;