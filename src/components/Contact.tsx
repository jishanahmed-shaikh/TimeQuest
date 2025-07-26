import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Bug,
  Lightbulb,
  Heart,
  Github,
  Twitter,
  Globe,
  Clock
} from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });

  const contactInfo = {
    name: 'Jishanahmed AR Shaikh',
    email: 'contact@timequest.app',
    phone: '+91 8591764236',
    address: 'Mumbai, India',
    timezone: 'IST (UTC+5:30)'
  };

  const categories = [
    { value: 'general', label: 'General Inquiry', icon: MessageCircle },
    { value: 'bug', label: 'Bug Report', icon: Bug },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb },
    { value: 'feedback', label: 'Feedback', icon: Heart }
  ];

  const socialLinks = [
    { name: 'GitHub', icon: Github, url: 'https://github.com/jishanahmed-shaikh/TimeQuest-DevPost' },
    { name: 'Twitter', icon: Twitter, url: 'https://www.x.com/jishanarshaikh' },
    { name: 'Website', icon: Globe, url: 'https://timequest-mauve.vercel.app/' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thanks for reaching out! We'll get back to you within 24 hours.",
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: ''
      });

      setIsSubmitting(false);
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Contact Header */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="bg-gradient-gold p-3 rounded-full gold-glow">
              <Mail className="w-6 h-6 text-gold-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gold text-glow font-orbitron">Contact Us</h2>
              <p className="text-sm text-muted-foreground font-inter">Get in touch with the TimeQuest team</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Form */}
        <Card className="card-texture retro-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
              <Send className="w-5 h-5" />
              Send Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-inter">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your full name"
                    className="bg-input border-border text-foreground"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-inter">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className="bg-input border-border text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-foreground font-inter">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {category.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-foreground font-inter">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Brief description of your inquiry"
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground font-inter">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tell us more about your inquiry..."
                  className="bg-input border-border text-foreground resize-none h-32"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                className="w-full bg-gradient-gold text-gold-foreground gold-glow hover:shadow-glow font-orbitron"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-gold-foreground border-t-transparent rounded-full" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
          {/* Contact Details */}
          <Card className="card-texture retro-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
                <Phone className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                <Mail className="w-5 h-5 text-gold" />
                <div>
                  <p className="text-sm text-muted-foreground font-inter">Email</p>
                  <p className="text-foreground font-inter">{contactInfo.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                <Phone className="w-5 h-5 text-gold" />
                <div>
                  <p className="text-sm text-muted-foreground font-inter">Phone</p>
                  <p className="text-foreground font-inter">{contactInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                <MapPin className="w-5 h-5 text-gold" />
                <div>
                  <p className="text-sm text-muted-foreground font-inter">Location</p>
                  <p className="text-foreground font-inter">{contactInfo.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                <Clock className="w-5 h-5 text-gold" />
                <div>
                  <p className="text-sm text-muted-foreground font-inter">Timezone</p>
                  <p className="text-foreground font-inter">{contactInfo.timezone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="card-texture retro-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
                <Globe className="w-5 h-5" />
                Connect With Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start gap-3 border-gold/30 text-gold hover:bg-gold/10"
                    onClick={() => window.open(link.url, '_blank')}
                  >
                    <Icon className="w-5 h-5" />
                    {link.name}
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Response Time */}
          <Card className="card-texture retro-border">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <div className="bg-gradient-success p-3 rounded-full shadow-success mx-auto w-fit">
                  <Clock className="w-6 h-6 text-success-foreground" />
                </div>
                <h4 className="font-semibold text-gold font-orbitron">Quick Response</h4>
                <p className="text-sm text-muted-foreground font-inter">
                  We typically respond to all inquiries within 24 hours during business days.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Preview */}
      <Card className="card-texture retro-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold font-orbitron">
            <MessageCircle className="w-5 h-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { q: 'How do I reset my password?', a: 'Use the "Forgot Password" link on the login page.' },
              { q: 'Can I export my data?', a: 'Yes, go to Settings > Data Management > Export Data.' },
              { q: 'How are coins calculated?', a: 'Coins are earned based on task completion and focus time.' },
              { q: 'Is TimeQuest free to use?', a: 'Yes, TimeQuest offers a comprehensive free tier.' }
            ].map((faq, index) => (
              <div key={index} className="p-3 bg-secondary/20 rounded-lg">
                <h4 className="font-medium text-gold font-inter mb-1">{faq.q}</h4>
                <p className="text-sm text-muted-foreground font-inter">{faq.a}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contact;