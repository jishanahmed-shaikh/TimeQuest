import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trophy, Zap, Target } from 'lucide-react';

const Auth = () => {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = async (type: 'signin' | 'signup') => {
    setLoading(true);
    try {
      const { error } = type === 'signin' 
        ? await signIn(formData.email, formData.password)
        : await signUp(formData.email, formData.password, formData.name);

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      } else if (type === 'signup') {
        toast({
          title: "Welcome to TimeQuest!",
          description: "Your account has been created successfully. You can now start your productivity journey!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-textured-retro scan-lines">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Hero Section */}
          <div className="order-1 lg:order-1">
            <div className="text-center lg:text-left space-y-4 mb-8">
              <div className="flex justify-center lg:justify-start">
                <div className="retro-card p-4 rounded-2xl animate-pulse-glow hover-lift">
                  <img src="/logotr.png" alt="TimeQuest Logo" className="w-20 h-20 mx-auto animate-float" />
                </div>
              </div>
              <h1 className="text-5xl font-orbitron text-retro-glow animate-shimmer">TimeQuest</h1>
              <p className="text-foreground/90 text-lg font-inter">
                Gamify your productivity. Earn rewards. Build streaks.
              </p>
              
              {/* Feature highlights */}
              <div className="flex justify-center lg:justify-start gap-6 mt-6">
                <div className="text-center hover-lift">
                  <div className="retro-card p-3 rounded-xl mb-2 neon-border hover-glow">
                    <Zap className="w-6 h-6 text-retro-glow mx-auto animate-retro-flicker" />
                  </div>
                  <p className="text-xs text-foreground/80 font-inter">Earn Coins</p>
                </div>
                <div className="text-center hover-lift">
                  <div className="retro-card p-3 rounded-xl mb-2 neon-border hover-glow">
                    <Target className="w-6 h-6 text-success mx-auto animate-retro-flicker" />
                  </div>
                  <p className="text-xs text-foreground/80 font-inter">Build Streaks</p>
                </div>
                <div className="text-center hover-lift">
                  <div className="retro-card p-3 rounded-xl mb-2 neon-border hover-glow">
                    <Trophy className="w-6 h-6 text-retro-glow mx-auto animate-retro-flicker" />
                  </div>
                  <p className="text-xs text-foreground/80 font-inter">Unlock Badges</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Auth Form */}
          <div className="order-2 lg:order-2">
            <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto space-y-6">
              <Card className="retro-card neon-border hover-glow">
                <CardHeader className="text-center">
                  <CardTitle className="text-retro-glow font-orbitron">Get Started</CardTitle>
                  <CardDescription className="text-muted-foreground font-inter">
                    Join the productivity quest today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="signin" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2 retro-card neon-border">
                      <TabsTrigger 
                        value="signin" 
                        className="data-[state=active]:btn-retro-gold data-[state=active]:text-primary-foreground font-orbitron"
                      >
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger 
                        value="signup" 
                        className="data-[state=active]:btn-retro-gold data-[state=active]:text-primary-foreground font-orbitron"
                      >
                        Sign Up
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-card-foreground font-inter">Email</Label>
                        <Input
                          id="signin-email"
                          name="email"
                          type="email"
                          placeholder="quest@timequest.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={loading}
                          className="input-retro font-inter"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-card-foreground font-inter">Password</Label>
                        <Input
                          id="signin-password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleInputChange}
                          disabled={loading}
                          className="input-retro font-inter"
                        />
                      </div>
                      <Button
                        onClick={() => handleSubmit('signin')}
                        disabled={loading}
                        className="w-full btn-retro-gold hover-lift font-orbitron"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Signing In...
                          </>
                        ) : (
                          'Start Your Quest'
                        )}
                      </Button>
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name" className="text-card-foreground font-inter">Name</Label>
                        <Input
                          id="signup-name"
                          name="name"
                          type="text"
                          placeholder="Quest Hero"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={loading}
                          className="input-retro font-inter"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-card-foreground font-inter">Email</Label>
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          placeholder="quest@timequest.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={loading}
                          className="input-retro font-inter"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-card-foreground font-inter">Password</Label>
                        <Input
                          id="signup-password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleInputChange}
                          disabled={loading}
                          className="input-retro font-inter"
                        />
                      </div>
                      <Button
                        onClick={() => handleSubmit('signup')}
                        disabled={loading}
                        className="w-full btn-retro-gold hover-lift font-orbitron"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          'Begin Your Journey'
                        )}
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <div className="text-center text-sm text-foreground/60 font-inter">
                Start completing tasks, earn coins, and build your productivity streak!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;