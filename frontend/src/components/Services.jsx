import React from 'react';
import { Brain, Zap, FileText, Laptop, Users, ArrowRight } from 'lucide-react';

export const Services = () => {
  const services = [
    {
      icon: Brain,
      title: 'AI Consulting',
      description: 'Strategic guidance to integrate AI into your business processes and develop roadmaps that drive growth.',
      features: ['AI Strategy Development', 'Process Automation Planning', 'Technology Assessment', 'ROI Analysis'],
    },
    {
      icon: Zap,
      title: 'AI Agents & Automation',
      description: 'Custom AI agents and automation workflows that handle repetitive tasks and boost productivity.',
      features: ['Custom AI Agents', 'Workflow Automation', 'Integration Setup', 'Performance Monitoring'],
    },
    {
      icon: FileText,
      title: 'Content Creation',
      description: 'Tech and AI-focused content that educates, engages, and converts your audience.',
      features: ['Technical Writing', 'Video Content', 'Social Media Strategy', 'Educational Materials'],
    },
    {
      icon: Laptop,
      title: 'SaaS & Tool Design',
      description: 'End-to-end development of AI-powered SaaS applications and digital tools.',
      features: ['MVP Development', 'UI/UX Design', 'Full-Stack Development', 'Launch Strategy'],
    },
    {
      icon: Users,
      title: 'Team Training',
      description: 'Comprehensive AI training programs to maximize adoption and effectiveness in your organization.',
      features: ['Workshop Sessions', 'Training Materials', 'Best Practices', 'Ongoing Support'],
    },
  ];

  return (
    <section id="services" className="relative py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-16 smooth-appear">
          <span className="section-label">What I Offer</span>
          <h2 className="editorial-heading text-4xl md:text-5xl mt-4 mb-6">
            Transform your business with AI
          </h2>
          <p className="body-text text-muted-foreground">
            From strategy to implementation, I help organizations harness the power of AI to solve real problems and create meaningful impact.
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group bg-card border border-border/50 rounded-xl p-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 smooth-appear flex flex-col"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                
                <h3 className="text-2xl font-serif font-semibold text-accent mb-3">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {service.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="mt-auto flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
