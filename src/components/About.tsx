import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Info, 
  Target, 
  Zap, 
  Trophy, 
  Users, 
  Rocket,
  Heart,
  Code,
  Gamepad2,
  Star
} from 'lucide-react';

const About = () => {
  const features = [
    { icon: Target, title: 'Task Management', description: 'Create and organize your quests with precision' },
    { icon: Zap, title: 'Pomodoro Timer', description: 'Focus sessions with customizable durations' },
    { icon: Trophy, title: 'Gamification', description: 'Earn coins, level up, and unlock achievements' },
    { icon: Users, title: 'Social Features', description: 'Connect with friends and join challenges' },
  ];

  const stats = [
    { label: 'Active Users', value: '10,000+', icon: Users },
    { label: 'Tasks Completed', value: '500K+', icon: Target },
    { label: 'Focus Hours', value: '1M+', icon: Zap },
    { label: 'Achievements Unlocked', value: '50K+', icon: Trophy },
  ];

  const team = [
    { name: 'Jishanahmed AR Shaikh', role: 'Creator & Developer', location: 'Mumbai, India' },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* About Header */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="bg-gradient-gold p-3 rounded-full gold-glow">
              <Info className="w-6 h-6 text-gold-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gold text-glow font-orbitron">About TimeQuest</h2>
              <p className="text-sm text-muted-foreground font-inter">Gamified productivity for the digital age</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Mission Statement */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
            <Rocket className="w-5 h-5" />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-foreground font-inter leading-relaxed">
            TimeQuest transforms productivity into an engaging adventure. We believe that achieving your goals 
            should be as exciting as playing your favorite game.
          </p>
          <p className="text-muted-foreground font-inter">
            By combining proven productivity techniques like the Pomodoro method with gamification elements, 
            we help you build lasting habits while having fun. Every task becomes a quest, every focus session 
            an adventure, and every achievement a victory worth celebrating.
          </p>
          <div className="bg-gold/10 p-4 rounded-lg border border-gold/20">
            <p className="text-gold font-medium font-inter">
              "Productivity is not about doing more things - it's about doing the right things consistently, 
              and enjoying the journey along the way."
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
            <Star className="w-5 h-5" />
            Key Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-4 bg-secondary/20 rounded-lg retro-border">
                  <div className="bg-gradient-gold p-2 rounded-full gold-glow">
                    <Icon className="w-5 h-5 text-gold-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gold font-orbitron">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground font-inter">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Platform Stats */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
            <Gamepad2 className="w-5 h-5" />
            Platform Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-4 bg-secondary/20 rounded-lg retro-border">
                  <div className="bg-gradient-gold p-3 rounded-full gold-glow mx-auto mb-3 w-fit">
                    <Icon className="w-6 h-6 text-gold-foreground" />
                  </div>
                  <p className="text-2xl font-bold text-gold font-orbitron">{stat.value}</p>
                  <p className="text-sm text-muted-foreground font-inter">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
            <Code className="w-5 h-5" />
            Technology Stack
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground font-inter">
            TimeQuest is built with modern web technologies to ensure a fast, reliable, and scalable experience.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Vite', 'shadcn/ui', 'Lucide Icons', 'React Query'].map((tech) => (
              <Badge key={tech} variant="outline" className="justify-center p-2 border-gold/30 text-gold">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
            <Heart className="w-5 h-5" />
            Meet the Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          {team.map((member, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-secondary/20 rounded-lg retro-border">
              <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center gold-glow">
                <Users className="w-6 h-6 text-gold-foreground" />
              </div>
              <div>
                <h4 className="font-semibold text-gold font-orbitron">{member.name}</h4>
                <p className="text-sm text-muted-foreground font-inter">{member.role}</p>
                <p className="text-xs text-muted-foreground font-inter">{member.location}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Version Info */}
      <Card className="card-texture retro-border">
        <CardContent className="text-center p-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gold font-orbitron">TimeQuest v1.0.0</h3>
            <p className="text-sm text-muted-foreground font-inter">Retro Edition - Built with ❤️ for productivity enthusiasts</p>
            <div className="flex justify-center gap-4 mt-4">
              <Badge variant="outline" className="border-gold/30 text-gold">
                Web App
              </Badge>
              <Badge variant="outline" className="border-gold/30 text-gold">
                Mobile Optimized
              </Badge>
              <Badge variant="outline" className="border-gold/30 text-gold">
                Open Source Ready
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;