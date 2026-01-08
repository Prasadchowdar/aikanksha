import React from 'react';
import { Lightbulb, Heart, Target } from 'lucide-react';

export const Philosophy = () => {
  const principles = [
    {
      icon: Lightbulb,
      title: 'Thoughtful Integration',
      description: 'AI should enhance human capability, not replace it. Every solution is designed with purpose and care.',
    },
    {
      icon: Heart,
      title: 'Human-Centered',
      description: 'Technology at its best is invisible. I focus on creating experiences that feel natural and intuitive.',
    },
    {
      icon: Target,
      title: 'Results-Driven',
      description: 'Beautiful solutions mean nothing without impact. Every project is measured by tangible outcomes.',
    },
  ];

  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-5 gap-16 items-start">
          {/* Left: Intro */}
          <div className="lg:col-span-2 space-y-6 smooth-appear">
            <span className="section-label">Philosophy</span>
            <h2 className="editorial-heading text-4xl md:text-5xl">
              Where strategy meets craft
            </h2>
            <p className="body-text text-muted-foreground">
              I'm an AI strategist and content creator passionate about making AI accessible, impactful, and delightful for everyone.
            </p>
            <p className="body-text text-muted-foreground">
              My approach combines strategic thinking with hands-on execution. I don't just advise—I build, implement, and optimize alongside your team.
            </p>
          </div>
          
          {/* Right: Principles */}
          <div className="lg:col-span-3 space-y-6">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <div
                  key={index}
                  className="card-warm flex gap-6 smooth-appear"
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-serif font-semibold text-accent">
                      {principle.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
