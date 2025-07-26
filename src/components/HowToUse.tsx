import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Play,
  Target,
  Timer,
  Trophy,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Coins,
  Flame,
  Gamepad2
} from 'lucide-react';

const HowToUse = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Play,
      description: 'Learn the basics of TimeQuest',
      content: {
        overview: 'Welcome to TimeQuest! Your journey to gamified productivity starts here.',
        points: [
          'Create your account and complete your profile',
          'Explore the dashboard to see your stats',
          'Understand the coin and XP system',
          'Check out your initial level and achievements'
        ]
      }
    },
    {
      id: 'creating-tasks',
      title: 'Creating Quests',
      icon: Target,
      description: 'Turn your tasks into epic quests',
      content: {
        overview: 'Every task in TimeQuest is a quest waiting to be conquered.',
        points: [
          'Click "Create Quest" to add a new task',
          'Give your quest a compelling name and description',
          'Set the estimated duration (15-120 minutes)',
          'Choose relevant category tags',
          'Save your quest and watch it appear in your quest log'
        ]
      }
    },
    {
      id: 'focus-sessions',
      title: 'Focus Sessions',
      icon: Timer,
      description: 'Master the art of focused work',
      content: {
        overview: 'Use the Pomodoro technique to maintain focus and track your progress.',
        points: [
          'Click "Quick Timer" for a 25-minute focus session',
          'Start the timer when you begin working',
          'Stay focused until the timer completes',
          'Take a short break when the session ends',
          'Earn coins and XP for completed sessions'
        ]
      }
    },
    {
      id: 'earning-rewards',
      title: 'Earning Rewards',
      icon: Trophy,
      description: 'Level up and unlock achievements',
      content: {
        overview: 'Complete quests and focus sessions to earn rewards and progress.',
        points: [
          'Earn coins for completing tasks and focus sessions',
          'Gain XP to level up your character',
          'Maintain daily streaks for bonus rewards',
          'Unlock achievements for major milestones',
          'Check the Rewards screen to see available prizes'
        ]
      }
    },
    {
      id: 'social-features',
      title: 'Social & Challenges',
      icon: Users,
      description: 'Connect with friends and join challenges',
      content: {
        overview: 'Make productivity social by connecting with friends and joining challenges.',
        points: [
          'Add friends using their invite codes',
          'Compare your progress on leaderboards',
          'Join weekly and monthly challenges',
          'Earn bonus rewards for challenge completion',
          'Share achievements with your network'
        ]
      }
    }
  ];

  const tips = [
    { icon: Star, title: 'Pro Tip', content: 'Set realistic quest durations to maintain momentum and avoid burnout.' },
    { icon: Coins, title: 'Coin Strategy', content: 'Complete quests early in the day to maximize your daily coin earnings.' },
    { icon: Flame, title: 'Streak Power', content: 'Maintain your daily streak for exponential bonus rewards.' },
    { icon: Gamepad2, title: 'Gamification', content: 'Think of each task as a quest in your personal RPG adventure.' }
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="bg-gradient-gold p-3 rounded-full gold-glow">
              <BookOpen className="w-6 h-6 text-gold-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gold text-glow font-orbitron">How to Use TimeQuest</h2>
              <p className="text-sm text-muted-foreground font-inter">Master your productivity quest</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Step Navigation */}
      <Card className="card-texture retro-border">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              return (
                <Button
                  key={step.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveStep(index)}
                  className={`gap-2 transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-gold text-gold-foreground gold-glow' 
                      : 'border-gold/30 text-gold hover:bg-gold/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline font-inter">{step.title}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Active Step Content */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
            {React.createElement(steps[activeStep].icon, { className: "w-5 h-5" })}
            {steps[activeStep].title}
          </CardTitle>
          <p className="text-muted-foreground font-inter">{steps[activeStep].description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground font-inter leading-relaxed">
            {steps[activeStep].content.overview}
          </p>
          
          <div className="space-y-3">
            {steps[activeStep].content.points.map((point, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-secondary/20 rounded-lg">
                <div className="bg-gradient-success p-1 rounded-full shadow-success mt-0.5">
                  <CheckCircle className="w-4 h-4 text-success-foreground" />
                </div>
                <p className="text-foreground font-inter">{point}</p>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="border-gold/30 text-gold hover:bg-gold/10"
            >
              Previous
            </Button>
            <Badge variant="outline" className="border-gold/30 text-gold px-4 py-1">
              {activeStep + 1} of {steps.length}
            </Badge>
            <Button
              variant="outline"
              onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
              disabled={activeStep === steps.length - 1}
              className="border-gold/30 text-gold hover:bg-gold/10"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Start Guide */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
            <Gamepad2 className="w-5 h-5" />
            Quick Start Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gold font-orbitron">Essential First Steps</h4>
              {[
                'Complete your profile setup',
                'Create your first quest',
                'Start a 25-minute focus session',
                'Check your achievements page'
              ].map((task, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-foreground font-inter">{task}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gold font-orbitron">Level Up Your Game</h4>
              {[
                'Connect with friends',
                'Join a challenge',
                'Maintain a 7-day streak',
                'Customize your settings'
              ].map((task, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-gold" />
                  <span className="text-foreground font-inter">{task}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pro Tips */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
            <Star className="w-5 h-5" />
            Pro Tips & Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-4 bg-secondary/20 rounded-lg retro-border">
                  <div className="bg-gradient-gold p-2 rounded-full gold-glow">
                    <Icon className="w-5 h-5 text-gold-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gold font-orbitron">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground font-inter">{tip.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
            <Timer className="w-5 h-5" />
            Keyboard Shortcuts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'Ctrl + N', action: 'Create New Quest' },
              { key: 'Ctrl + T', action: 'Start Quick Timer' },
              { key: 'Space', action: 'Pause/Resume Timer' },
              { key: 'Esc', action: 'Close Modals' },
              { key: 'Ctrl + S', action: 'Save Settings' },
              { key: 'Ctrl + R', action: 'View Rewards' }
            ].map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-secondary/20 rounded">
                <span className="text-foreground font-inter">{shortcut.action}</span>
                <Badge variant="outline" className="border-gold/30 text-gold font-mono">
                  {shortcut.key}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HowToUse;