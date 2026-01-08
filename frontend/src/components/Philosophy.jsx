import React from 'react';
import { Lightbulb, Heart, Target } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section id="about" className="relative py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-20 items-end"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <span className="section-label">Philosophy</span>
            <h2 className="editorial-heading">
              Strategy without craft is hollow. <br />
              <span className="text-muted-foreground italic font-light">Craft without strategy is decoration.</span>
            </h2>
          </motion.div>
          <motion.div variants={itemVariants} className="lg:pb-4">
            <p className="body-text">
              I bridge the gap between abstract AI capabilities and tangible business value. My approach is rooted in the belief that technology should amplify human potential, not obscure it.
            </p>
          </motion.div>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-6"
        >
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            // Bento styling logic: First item spans 2 cols, others span 1
            const spanClass = index === 0 ? 'md:col-span-2' : 'md:col-span-1';

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={spanClass}
              >
                <SpotlightCard className="h-full p-8">
                  <div className="flex flex-col justify-between h-full">
                    <div className="mb-8">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-serif font-medium text-foreground mb-4">
                        {principle.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {principle.description}
                      </p>
                    </div>

                    {/* Decorative line/number */}
                    <div className="w-full h-px bg-neutral-100 relative mt-auto">
                      <span className="absolute right-0 -top-3 text-xs font-mono text-muted-foreground/30">
                        0{index + 1}
                      </span>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
