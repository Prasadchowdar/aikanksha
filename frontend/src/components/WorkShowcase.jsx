import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';

export const WorkShowcase = () => {
  const [activeProject, setActiveProject] = useState(0);
  
  const projects = [
    {
      title: 'Steora AI Transformation',
      client: 'Steora',
      description: 'Led comprehensive AI training program for employees and built custom AI agents that automated key business processes.',
      impact: '40% efficiency improvement',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop',
      tags: ['AI Training', 'Custom Agents', 'Process Automation'],
      stats: [
        { label: 'Efficiency Gain', value: '40%' },
        { label: 'Hours Saved', value: '500+' },
        { label: 'Team Size', value: '25' },
      ],
    },
    {
      title: 'E-commerce AI Assistant',
      client: 'Confidential Client',
      description: 'Developed an intelligent customer service AI agent that handles inquiries automatically, improving response times and satisfaction.',
      impact: '80% of inquiries automated',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop',
      tags: ['Customer Service', 'AI Agent', 'E-commerce'],
      stats: [
        { label: 'Automation Rate', value: '80%' },
        { label: 'Response Time', value: '-65%' },
        { label: 'CSAT Score', value: '+35%' },
      ],
    },
    {
      title: 'Content Automation Platform',
      client: 'Coming Soon',
      description: 'Building a comprehensive platform that automates content creation workflows for digital marketers and content creators.',
      impact: 'In Development',
      image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=800&auto=format&fit=crop',
      tags: ['Content Creation', 'Automation', 'SaaS'],
      stats: [
        { label: 'Launch', value: 'Q2 2025' },
        { label: 'Beta Users', value: '100+' },
        { label: 'Features', value: '15+' },
      ],
    },
  ];

  return (
    <section id="work" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-16 smooth-appear">
          <span className="section-label">Case Studies</span>
          <h2 className="editorial-heading text-4xl md:text-5xl mt-4 mb-6">
            Real impact, measured results
          </h2>
          <p className="body-text text-muted-foreground">
            A selection of recent projects that demonstrate the transformative power of thoughtful AI integration.
          </p>
        </div>
        
        {/* Project Tabs */}
        <div className="flex flex-wrap gap-4 mb-12">
          {projects.map((project, index) => (
            <button
              key={index}
              onClick={() => setActiveProject(index)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeProject === index
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-card border border-border/50 text-muted-foreground hover:border-primary/50'
              }`}
            >
              {project.client}
            </button>
          ))}
        </div>
        
        {/* Active Project */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative smooth-appear">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={projects[activeProject].image}
                alt={projects[activeProject].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/30 to-transparent" />
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-6 smooth-appear">
            <div className="flex flex-wrap gap-2">
              {projects[activeProject].tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary border-0">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h3 className="text-3xl md:text-4xl font-serif font-semibold text-accent">
              {projects[activeProject].title}
            </h3>
            
            <p className="body-text text-muted-foreground">
              {projects[activeProject].description}
            </p>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-lg">
              <span className="text-sm font-medium text-secondary">
                {projects[activeProject].impact}
              </span>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/50">
              {projects[activeProject].stats.map((stat, idx) => (
                <div key={idx}>
                  <div className="text-2xl font-serif font-semibold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            
            <button className="flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all pt-4">
              View Full Case Study
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
