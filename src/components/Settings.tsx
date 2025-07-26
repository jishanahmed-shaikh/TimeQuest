import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AudioManager from '@/utils/audioManager';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Volume2, 
  Moon, 
  Sun, 
  Shield, 
  Database,
  Trash2,
  Download,
  LogOut,
  Palette,
  Timer,
  Smartphone,
  Play
} from 'lucide-react';

const Settings = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    darkMode: true,
    autoBreaks: false,
    focusReminders: true,
    weeklyReports: true,
    soundVolume: [75],
    defaultTimerDuration: 25,
    autoStartTimer: false,
    vibrations: true,
    selectedAudio: 'simple.wav'
  });

  const audioFiles = [
    { value: 'simple.wav', label: 'Simple Bell' },
    { value: 'softbell.wav', label: 'Soft Bell' },
    { value: 'tingtong.wav', label: 'Ting Tong' },
    { value: 'ticktockclose.wav', label: 'Tick Tock Close' },
    { value: 'retrogamingclock.wav', label: 'Retro Gaming Clock' },
    { value: 'sound1digital.mp3', label: 'Digital Sound' }
  ];

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('timequest_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prev => ({ ...prev, ...parsed }));
    }

    // Load individual settings
    const savedAudio = localStorage.getItem('timequest_selected_audio');
    const savedVolume = localStorage.getItem('timequest_audio_volume');
    const savedTheme = localStorage.getItem('timequest_theme');

    if (savedAudio) {
      setSettings(prev => ({ ...prev, selectedAudio: savedAudio }));
    }
    if (savedVolume) {
      setSettings(prev => ({ ...prev, soundVolume: [parseInt(savedVolume)] }));
    }
    if (savedTheme) {
      setSettings(prev => ({ ...prev, darkMode: savedTheme === 'dark' }));
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    // Save to localStorage
    localStorage.setItem('timequest_settings', JSON.stringify(newSettings));

    // Handle specific settings
    if (key === 'darkMode') {
      document.documentElement.classList.toggle('dark', value);
      localStorage.setItem('timequest_theme', value ? 'dark' : 'light');
    } else if (key === 'selectedAudio') {
      localStorage.setItem('timequest_selected_audio', value);
    } else if (key === 'soundVolume') {
      localStorage.setItem('timequest_audio_volume', value[0].toString());
    }

    toast({
      title: "Setting Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} has been updated.`,
    });
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

  const exportData = () => {
    // Mock data export
    const data = {
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timequest-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Your settings have been exported successfully.",
    });
  };

  const clearAllData = () => {
    // Clear all TimeQuest related localStorage data
    const keysToRemove = [
      'timequest_user',
      'timequest_tasks',
      'timequest_rewards',
      'timequest_auth',
      'timequest_settings',
      'timequest_selected_audio',
      'timequest_audio_volume',
      'timequest_theme'
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    // Reset settings to defaults
    setSettings({
      notifications: true,
      soundEffects: true,
      darkMode: true,
      autoBreaks: false,
      focusReminders: true,
      weeklyReports: true,
      soundVolume: [75],
      defaultTimerDuration: 25,
      autoStartTimer: false,
      vibrations: true,
      selectedAudio: 'simple.wav'
    });

    toast({
      title: "Data Cleared",
      description: "All local data has been cleared. You may need to refresh the page.",
      variant: "destructive",
    });
  };

  const [isTestingAudio, setIsTestingAudio] = useState(false);

  const testAudio = () => {
    const audioManager = AudioManager.getInstance();
    
    if (isTestingAudio) {
      // Stop current test
      audioManager.stopAllAudio();
      setIsTestingAudio(false);
    } else {
      // Start new test
      try {
        audioManager.playOneTimeAudio(settings.selectedAudio, settings.soundVolume[0] / 100);
        setIsTestingAudio(true);
        
        // Auto-stop after 3 seconds
        setTimeout(() => {
          setIsTestingAudio(false);
        }, 3000);
      } catch (error) {
        console.error('Error testing audio:', error);
        toast({
          title: "Audio Test Failed",
          description: "Could not play the selected audio file.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Settings Header */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="bg-gradient-gold p-3 rounded-full gold-glow">
              <SettingsIcon className="w-6 h-6 text-gold-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gold text-glow font-orbitron">Settings</h2>
              <p className="text-sm text-muted-foreground font-inter">Customize your TimeQuest experience</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Notifications */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications" className="text-foreground font-inter">Push Notifications</Label>
              <p className="text-sm text-muted-foreground font-inter">Receive quest updates and reminders</p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="focusReminders" className="text-foreground font-inter">Focus Reminders</Label>
              <p className="text-sm text-muted-foreground font-inter">Remind you to start focus sessions</p>
            </div>
            <Switch
              id="focusReminders"
              checked={settings.focusReminders}
              onCheckedChange={(checked) => handleSettingChange('focusReminders', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weeklyReports" className="text-foreground font-inter">Weekly Reports</Label>
              <p className="text-sm text-muted-foreground font-inter">Get weekly productivity insights</p>
            </div>
            <Switch
              id="weeklyReports"
              checked={settings.weeklyReports}
              onCheckedChange={(checked) => handleSettingChange('weeklyReports', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Audio & Visual */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
            <Volume2 className="w-5 h-5" />
            Audio & Visual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="soundEffects" className="text-foreground font-inter">Sound Effects</Label>
              <p className="text-sm text-muted-foreground font-inter">Play sounds for interactions</p>
            </div>
            <Switch
              id="soundEffects"
              checked={settings.soundEffects}
              onCheckedChange={(checked) => handleSettingChange('soundEffects', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-inter">Timer Audio Selection</Label>
            <Select
              value={settings.selectedAudio}
              onValueChange={(value) => handleSettingChange('selectedAudio', value)}
            >
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {audioFiles.map(audio => (
                  <SelectItem key={audio.value} value={audio.value}>
                    {audio.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="outline"
              onClick={testAudio}
              className={`w-full ${isTestingAudio ? 'border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground' : 'border-gold text-gold hover:bg-gold hover:text-gold-foreground'}`}
            >
              <Play className="w-3 h-3 mr-2" />
              {isTestingAudio ? 'Stop Test' : 'Test Audio'}
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-inter">Sound Volume</Label>
            <Slider
              value={settings.soundVolume}
              onValueChange={(value) => handleSettingChange('soundVolume', value)}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-inter">
              <span>Silent</span>
              <span>{settings.soundVolume[0]}%</span>
              <span>Loud</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="vibrations" className="text-foreground font-inter">Vibrations (Mobile)</Label>
              <p className="text-sm text-muted-foreground font-inter">Haptic feedback for interactions</p>
            </div>
            <Switch
              id="vibrations"
              checked={settings.vibrations}
              onCheckedChange={(checked) => handleSettingChange('vibrations', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Timer Settings */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
            <Timer className="w-5 h-5" />
            Timer Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground font-inter">Default Timer Duration</Label>
            <Select
              value={settings.defaultTimerDuration.toString()}
              onValueChange={(value) => handleSettingChange('defaultTimerDuration', parseInt(value))}
            >
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="25">25 minutes (Pomodoro)</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoBreaks" className="text-foreground font-inter">Auto Break Reminders</Label>
              <p className="text-sm text-muted-foreground font-inter">Automatic break suggestions after sessions</p>
            </div>
            <Switch
              id="autoBreaks"
              checked={settings.autoBreaks}
              onCheckedChange={(checked) => handleSettingChange('autoBreaks', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoStartTimer" className="text-foreground font-inter">Auto-start Timer</Label>
              <p className="text-sm text-muted-foreground font-inter">Start timer automatically when task begins</p>
            </div>
            <Switch
              id="autoStartTimer"
              checked={settings.autoStartTimer}
              onCheckedChange={(checked) => handleSettingChange('autoStartTimer', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
            <Palette className="w-5 h-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="darkMode" className="text-foreground font-inter">Retro Dark Theme</Label>
              <p className="text-sm text-muted-foreground font-inter">Use the dark retro interface</p>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-muted-foreground" />
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
              />
              <Moon className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
            <Database className="w-5 h-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={exportData}
              className="border-gold text-gold hover:bg-gold hover:text-gold-foreground"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button
              variant="outline"
              onClick={clearAllData}
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
            <Shield className="w-5 h-5" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2 font-inter">
            You'll need to sign in again to access your account
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;