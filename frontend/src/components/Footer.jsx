import React from 'react';
import { Heart } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    Services: [
      { label: 'AI Consulting', href: '#services' },
      { label: 'AI Agents & Automation', href: '#services' },
      { label: 'Content Creation', href: '#services' },
      { label: 'SaaS Development', href: '#services' },
    ],
    Resources: [
      { label: 'FastFeedAI Blog', href: 'https://www.fastfeedai.com', external: true },
      { label: 'Case Studies', href: '#work' },
      { label: 'Newsletter', href: '#contact' },
    ],
    Connect: [
      { label: 'Instagram', href: 'https://www.instagram.com/aikanksha', external: true },
      { label: 'YouTube', href: 'https://www.youtube.com/@aikanksha', external: true },
      { label: 'Email', href: 'mailto:info@aikanksha.com', external: true },
    ],
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="relative bg-accent/5 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-serif font-semibold text-accent mb-4">
              Aikanksha
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Making AI accessible, impactful, and delightful through strategic guidance and thoughtful implementation.
            </p>
          </div>
          
          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <button
                        onClick={() => scrollToSection(link.href.replace('#', ''))}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm text-left"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            © {currentYear} Aikanksha. Crafted with <Heart className="w-4 h-4 text-primary fill-primary" /> and purpose.
          </p>
          <div className="flex gap-6 text-sm">
            <button className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </button>
            <button className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
