import React from 'react';
import { ArrowUpRight, Clock } from 'lucide-react';

export const Insights = () => {
  const articles = [
    {
      title: '7 AI Tools Every Beginner Needs to Know in 2025',
      excerpt: 'Discover free, beginner-friendly AI tools that make tech tasks easier—from creative design to writing.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop',
      category: 'Tools',
      readTime: '5 min',
      url: 'https://www.fastfeedai.com/p/7-ai-tools-every-beginner-needs-to-know-in-2025-free-and-easy-to-use',
    },
    {
      title: '5 AI Website Builders That Let You Launch a Site in a Weekend',
      excerpt: 'Top AI website builders that let you launch a full website in a weekend - no code, no hassle.',
      image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=600&auto=format&fit=crop',
      category: 'Development',
      readTime: '7 min',
      url: 'https://www.fastfeedai.com/p/5-ai-website-builders-that-let-you-launch-a-site-in-a-weekend-b362b43411069923',
    },
    {
      title: 'Microsoft Just Laid Off 9,000 People. What\'s Replacing Them?',
      excerpt: 'AI agents are quietly taking over tasks at scale. Here\'s a simple guide to what they are and how they work.',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop',
      category: 'Industry',
      readTime: '6 min',
      url: 'https://www.fastfeedai.com/p/microsoft-just-laid-off-9-000-people-what-s-replacing-them-b40e',
    },
    {
      title: 'Stop Settling for Generic AI Replies',
      excerpt: 'The easiest way to turn ChatGPT, Claude, or Gemini into a real problem-solver.',
      image: 'https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?q=80&w=600&auto=format&fit=crop',
      category: 'Strategy',
      readTime: '4 min',
      url: 'https://www.fastfeedai.com/p/stop-settling-for-generic-ai-replies-dcf8',
    },
  ];

  return (
    <section id="insights" className="relative py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 smooth-appear">
          <div className="max-w-2xl">
            <span className="section-label">Latest from FastFeedAI</span>
            <h2 className="editorial-heading text-4xl md:text-5xl mt-4 mb-4">
              Insights that matter
            </h2>
            <p className="body-text text-muted-foreground">
              Weekly AI insights, tips, and news—straight from the blog. Practical knowledge you can apply immediately.
            </p>
          </div>
          <a
            href="https://www.fastfeedai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all whitespace-nowrap"
          >
            View All Articles
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>
        
        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {articles.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card border border-border/50 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 smooth-appear flex flex-col"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-background/90 backdrop-blur-sm text-xs font-medium rounded-full border border-border/50">
                    {article.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readTime} read</span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-serif font-semibold text-accent mb-3 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {article.excerpt}
                </p>
                
                <div className="mt-auto flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                  Read Article
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
