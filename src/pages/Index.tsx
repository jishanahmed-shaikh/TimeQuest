import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Auth from '@/components/Auth';
import Dashboard from '@/components/Dashboard';
import Navigation from '@/components/Navigation';
import UserProfile from '@/components/UserProfile';
import Settings from '@/components/Settings';
import About from '@/components/About';
import HowToUse from '@/components/HowToUse';
import Contact from '@/components/Contact';
import RewardsScreen from '@/components/RewardsScreen';
import RewardsPage from '@/components/RewardsPage';
import TimerModal from '@/components/TimerModal';
import TimerPage from '@/components/TimerPage';
import SocialPage from '@/components/SocialPage';
import MiniTimer from '@/components/MiniTimer';

const Index = () => {
  const { user, loading } = useAuth();
  const [currentSection, setCurrentSection] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-texture">
        <div className="animate-spin text-gold text-xl font-orbitron">
          Loading TimeQuest...
        </div>
      </div>
    );
  }

  if (!user) return <Auth />;

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard': return <Dashboard />;
      case 'profile': return <UserProfile />;
      case 'settings': return <Settings />;
      case 'about': return <About />;
      case 'how-to-use': return <HowToUse />;
      case 'contact': return <Contact />;
      case 'rewards': return <RewardsPage />;
      case 'timer': return <TimerPage />;
      case 'social': return <SocialPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-textured-retro">
      <Navigation 
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />
      
      <main className="md:ml-64 min-h-screen">
        {renderSection()}
      </main>

      {/* Mini Timer - Always present when user is logged in */}
      <MiniTimer onTaskComplete={() => {
        // Refresh dashboard if we're on it
        if (currentSection === 'dashboard') {
          window.location.reload();
        }
      }} />
    </div>
  );
};

export default Index;
