import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Timer, Trophy, Users, Settings, User, BookOpen, Mail, Info } from 'lucide-react';

interface NavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation = ({ currentSection, onSectionChange }: NavigationProps) => {
  const mobileNavItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'rewards', label: 'Rewards', icon: Trophy },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const desktopNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'rewards', label: 'Rewards', icon: Trophy },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'how-to-use', label: 'How to Use', icon: BookOpen },
    { id: 'about', label: 'About', icon: Info },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-card card-texture backdrop-blur-sm border-t border-gold/20 p-2 md:hidden z-50 safe-area-inset-bottom">
        <div className="flex justify-around max-w-md mx-auto">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onSectionChange(item.id)}
                className={`flex flex-col gap-1 h-14 px-2 transition-all duration-300 ${
                  isActive 
                    ? 'text-gold bg-gold/10 shadow-glow' 
                    : 'text-muted-foreground hover:text-gold hover:bg-gold/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'animate-glow-pulse' : ''}`} />
                <span className="text-xs font-orbitron">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-gradient-card card-texture border-r border-gold/20 p-4 z-40">
        <div className="flex flex-col w-full">
          {/* Logo */}
          <div className="mb-8 p-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img 
                src="/logotr.png" 
                alt="TimeQuest Logo" 
                className="w-8 h-8 object-contain animate-glow-pulse"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h1 className="text-2xl font-bold text-gold text-glow font-orbitron">TimeQuest</h1>
            </div>
            <p className="text-sm text-muted-foreground font-inter">Gamified Productivity</p>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col space-y-2">
            {desktopNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => onSectionChange(item.id)}
                  className={`justify-start gap-3 h-12 transition-all duration-300 ${
                    isActive 
                      ? 'text-gold bg-gold/10 shadow-glow retro-border' 
                      : 'text-muted-foreground hover:text-gold hover:bg-gold/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'animate-glow-pulse' : ''}`} />
                  <span className="font-inter">{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Bottom Space for Mobile Indicator */}
          <div className="mt-auto pt-4 text-center">
            <div className="text-xs text-muted-foreground font-inter">
              v1.0.0 - Retro Edition
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;