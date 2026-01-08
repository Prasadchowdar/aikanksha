import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Calendar, Instagram, Youtube, CheckCircle2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      toast.success('Successfully subscribed to the newsletter!');
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      toast.success('Message sent! I\'ll get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
    }, 1000);
  };

  const benefits = [
    'Weekly AI updates and insights',
    'Exclusive tool recommendations',
    'Behind-the-scenes content',
    'Actionable implementation guides',
  ];

  return (
    <section id="contact" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Newsletter */}
          <div className="smooth-appear">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="section-label text-primary">1,000+ subscribers</span>
            </div>
            
            <h2 className="editorial-heading text-4xl md:text-5xl mb-4">
              Stay ahead of the AI curve
            </h2>
            
            <p className="body-text text-muted-foreground mb-8">
              Join 1,000+ professionals who receive weekly AI insights, tool recommendations, and exclusive content straight to their inbox.
            </p>
            
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 bg-background border-border/50"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-warm px-8 h-12"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Weekly content • Free to join • Unsubscribe anytime
              </p>
            </form>
            
            {/* Social Links */}
            <div className="mt-12 pt-8 border-t border-border/50">
              <p className="text-sm font-medium text-foreground mb-4">Connect with me</p>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/aikanksha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-lg bg-muted border border-border/50 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.youtube.com/@aikanksha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-lg bg-muted border border-border/50 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="smooth-appear" style={{ animationDelay: '0.1s' }}>
            <span className="section-label">Get in Touch</span>
            <h3 className="text-3xl font-serif font-semibold text-accent mt-4 mb-6">
              Let's work together
            </h3>
            
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 bg-background border-border/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-background border-border/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <Textarea
                  placeholder="Tell me about your project..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[150px] bg-background border-border/50 resize-none"
                />
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-warm h-12"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
            
            <div className="mt-8 space-y-4">
              <a
                href="mailto:info@aikanksha.com"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>info@aikanksha.com</span>
              </a>
              <a
                href="https://calendly.com/aikanksha"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Calendar className="w-5 h-5" />
                <span>Book a 30-minute consultation</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
