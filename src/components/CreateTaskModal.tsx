import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { MockTaskService } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';
import { Plus, Target } from 'lucide-react';

interface CreateTaskModalProps {
  onTaskCreated?: () => void;
}

const CreateTaskModal = ({ onTaskCreated }: CreateTaskModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration_minutes: 25,
    tags: [] as string[]
  });

  const categories = [
    'Work', 'Study', 'Exercise', 'Creative', 'Personal', 'Health', 'Learning', 'Projects'
  ];

  const durations = [
    { label: '15 minutes', value: 15 },
    { label: '25 minutes (Pomodoro)', value: 25 },
    { label: '30 minutes', value: 30 },
    { label: '45 minutes', value: 45 },
    { label: '60 minutes', value: 60 },
    { label: '90 minutes', value: 90 },
    { label: '120 minutes', value: 120 }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title.trim()) return;

    setIsLoading(true);
    try {
      const { data, error } = await MockTaskService.createTask({
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        duration_minutes: formData.duration_minutes,
        tags: formData.tags,
        status: 'pending'
      });

      if (error) throw error;

      toast({
        title: "Quest Created!",
        description: "Your new task has been added to your quest log.",
      });

      setFormData({ title: '', description: '', duration_minutes: 25, tags: [] });
      setIsOpen(false);
      onTaskCreated?.();
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          size="xl" 
          className="flex items-center gap-3 h-20 bg-gradient-primary text-primary-foreground shadow-gold hover:shadow-glow transition-all duration-300 font-orbitron"
        >
          <Plus className="w-6 h-6" />
          <div className="text-left">
            <div className="font-bold">Create Quest</div>
            <div className="text-sm opacity-80">Start a new mission</div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gradient-card border-border shadow-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gold font-orbitron">
            <Target className="w-5 h-5" />
            Create New Quest
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground font-inter">Quest Name</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter your quest objective..."
              className="bg-input border-border text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground font-inter">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your quest details..."
              className="bg-input border-border text-foreground resize-none h-20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-inter">Duration</Label>
            <Select
              value={formData.duration_minutes.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(value) }))}
            >
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {durations.map(duration => (
                  <SelectItem key={duration.value} value={duration.value.toString()}>
                    {duration.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-inter">Category Tags</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  type="button"
                  variant={formData.tags.includes(category) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTag(category)}
                  className={`font-inter text-xs ${
                    formData.tags.includes(category)
                      ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-border text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.title.trim()}
              className="flex-1 bg-gradient-primary text-primary-foreground shadow-gold hover:shadow-glow font-orbitron"
            >
              {isLoading ? 'Creating...' : 'Create Quest'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;