import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';

export const Hero = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-background -z-10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Content */}
          <motion.div
            className="space-y-10"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-semibold tracking-widest uppercase text-primary/90">Available for new projects</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="editorial-heading leading-tight">
              Where human insight meets <br />
              <span className="text-primary italic font-serif">machine intelligence</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="body-text max-w-xl font-light text-muted-foreground/90">
              I help visionaries decode the complexity of AI, transforming abstract potential into tangible, human-centered growth strategies.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 pt-4">
              <Button
                onClick={() => scrollToSection('services')}
                className="btn-warm"
              >
                Explore Services
              </Button>
              <Button
                onClick={() => scrollToSection('contact')}
                variant="outline"
                className="btn-outline-warm"
              >
                Start a Conversation
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 sm:grid-cols-4 gap-10 pt-10 border-t border-white/10">
              {[
                { value: '15+', label: 'AI Projects' },
                { value: '25+', label: 'Automations' },
                { value: '5K+', label: 'Hours Saved' },
                { value: '10+', label: 'Happy Clients' },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl font-serif font-medium text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium tracking-wider uppercase text-muted-foreground mt-2">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Image with 3D Tilt */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:h-[600px] flex items-center justify-center p-8"
          >
            <Tilt
              className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-full rounded-2xl overflow-hidden shadow-2xl border border-white/5 group"
              perspective={1000}
              glareEnable={true}
              glareMaxOpacity={0.45}
              scale={1.02}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 z-10" />
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
                alt="Akanksha - AI Consultant"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 saturate-[0.8]"
              />
            </Tilt>

            {/* Decorative Element */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -z-10 mix-blend-screen"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
