import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Hero = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-bone via-background to-muted/30 -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-8 smooth-appear" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="section-label text-primary">Available for new projects</span>
            </div>
            
            <h1 className="editorial-heading text-5xl md:text-6xl lg:text-7xl">
              Making AI your{' '}
              <span className="text-primary italic">growth partner</span>
            </h1>
            
            <p className="body-text text-xl text-muted-foreground max-w-xl">
              Strategic AI integration with a human touch. Transforming complex challenges into elegant solutions through thoughtful design and purposeful automation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={() => scrollToSection('services')}
                className="btn-warm text-base px-10 py-6"
              >
                Explore Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => scrollToSection('contact')}
                variant="outline"
                className="btn-outline-warm text-base px-10 py-6"
              >
                Book a Call
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8 border-t border-border/50">
              {[
                { value: '15+', label: 'AI Projects' },
                { value: '25+', label: 'Automations' },
                { value: '5K+', label: 'Hours Saved' },
                { value: '10+', label: 'Happy Clients' },
              ].map((stat, index) => (
                <div key={index} className="smooth-appear" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                  <div className="text-3xl font-serif font-semibold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right: Image */}
          <div className="relative smooth-appear" style={{ animationDelay: '0.2s' }}>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
                alt="Akanksha - AI Consultant"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent" />
            </div>
            
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};
