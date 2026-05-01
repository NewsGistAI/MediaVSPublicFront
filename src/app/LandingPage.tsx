import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Globe2, TrendingUp, Languages, ArrowRight } from 'lucide-react';

const featuredNews = [
  {
    id: 1,
    title: "China's Tech Innovation Push",
    titleZh: "中国科技创新突破",
    category: "Technology",
    date: "April 23, 2026",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop",
    summary: "China announces major breakthroughs in quantum computing and AI development, positioning itself as a global tech leader.",
    mediaOpinion: "Global media coverage highlights China's rapid advancements in quantum computing and AI, with varying degrees of emphasis on technological sovereignty.",
    publicOpinion: "Public reaction is largely enthusiastic, with national pride driving positive sentiment. Some voices call for more open international collaboration.",
    controversy: 4
  },
  {
    id: 2,
    title: "Belt and Road Initiative Expansion",
    titleZh: "一带一路倡议新阶段",
    category: "Business",
    date: "April 22, 2026",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=450&fit=crop",
    summary: "New infrastructure projects announced across Southeast Asia and Africa as part of expanded Belt and Road Initiative.",
    mediaOpinion: "Coverage is polarized between highlighting economic development opportunities and raising concerns about debt sustainability.",
    publicOpinion: "Public opinion is divided, with strong support domestically but mixed international reactions focusing on economic impact.",
    controversy: 5
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'en' | 'zh'>('en');

  return (
    <div className="min-h-screen bg-[var(--news-cream)]" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      {/* Header */}
      <header className="border-b border-[var(--news-indigo)]/10 bg-[var(--news-cream)] py-4 px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/news')}>
            <Globe2 className="w-8 h-8 text-[var(--news-indigo)]" />
            <div>
              <h1 style={{ fontFamily: 'Crimson Pro, serif', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2, color: 'var(--news-indigo)' }}>
                NewsGist
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-[var(--news-indigo)]/20 rounded-lg hover:border-[var(--news-indigo)] transition-colors text-sm font-medium text-[var(--news-indigo)]"
            >
              <Languages className="w-4 h-4" />
              {language === 'en' ? '中文' : 'English'}
            </button>
            
            <button
              onClick={() => navigate('/news')}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--news-indigo)] text-white rounded-lg hover:bg-[var(--news-indigo)]/90 transition-colors text-sm font-medium"
            >
              {language === 'en' ? 'Browse All Topics' : '浏览所有主题'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: 'Crimson Pro, serif',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 700,
              color: 'var(--news-indigo)',
              lineHeight: 1.2,
              marginBottom: '1.5rem'
            }}
          >
            {language === 'en' ? 'See Every Side of the Story' : '看见故事的多面性'}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: 'Noto Serif SC, serif',
              fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              color: 'var(--foreground)',
              lineHeight: 1.6,
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            {language === 'en' 
              ? 'Balanced perspectives from official media and public voices'
              : '官方媒体与公众声音的平衡呈现'}
          </motion.p>
        </div>
      </section>

      {/* Featured News Cards */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto space-y-12">
          {featuredNews.map((news, index) => (
            <motion.article
              key={news.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-white rounded-xl border border-[var(--news-indigo)]/10 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/news')}
            >
              {/* Card Header with Image */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 md:p-8">
                {/* Text Content */}
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--news-jade)] text-white uppercase tracking-wider">
                      {news.category}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)] font-medium">
                      {news.date}
                    </span>
                  </div>
                  
                  <h3 style={{
                    fontFamily: 'Crimson Pro, serif',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'var(--news-indigo)',
                    lineHeight: 1.2,
                    marginBottom: '1rem'
                  }}>
                    {language === 'en' ? news.title : news.titleZh}
                  </h3>
                  
                  <p style={{ color: 'var(--foreground)', lineHeight: 1.7, fontSize: '1rem', marginBottom: '1.5rem' }} className="font-serif">
                    {news.summary}
                  </p>

                  {/* Controversy Indicator */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-semibold">
                      {language === 'en' ? 'Controversy Level' : '争议度'}
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className="w-4 h-4 rounded-sm"
                          style={{
                            backgroundColor: level <= news.controversy 
                              ? level >= 4 ? 'var(--news-vermillion)' 
                              : level >= 3 ? 'var(--news-amber)' 
                              : 'var(--news-jade)'
                              : '#e5e7eb'
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-[var(--news-indigo)] ml-1">
                      {news.controversy}/5
                    </span>
                  </div>
                </div>

                {/* Image */}
                <div className="lg:col-span-1">
                  <div className="rounded-lg overflow-hidden shadow-md" style={{ aspectRatio: '16/9' }}>
                    <img
                      src={news.image}
                      alt={language === 'en' ? news.title : news.titleZh}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Dual Perspective Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--news-indigo)]/10 border-t border-[var(--news-indigo)]/10">
                {/* Official Media Preview */}
                <div className="bg-white p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe2 className="w-4 h-4 text-[var(--news-indigo)]" />
                    <h4 className="font-serif text-sm font-bold text-[var(--news-indigo)] uppercase tracking-wider">
                      {language === 'en' ? 'Official Media' : '官方媒体'}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                    {news.mediaOpinion}
                  </p>
                </div>

                {/* Public Voice Preview */}
                <div className="bg-white p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-[var(--news-vermillion)]" />
                    <h4 className="font-serif text-sm font-bold text-[var(--news-vermillion)] uppercase tracking-wider">
                      {language === 'en' ? 'Public Voice' : '公众声音'}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                    {news.publicOpinion}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-[var(--news-cream)] to-white rounded-2xl p-8 md:p-12 border border-[var(--news-indigo)]/20"
          >
            <h3 style={{
              fontFamily: 'Crimson Pro, serif',
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--news-indigo)',
              marginBottom: '1rem'
            }}>
              {language === 'en' ? 'Explore More Perspectives' : '探索更多视角'}
            </h3>
            <p className="text-gray-600 mb-6" style={{ lineHeight: 1.7 }}>
              {language === 'en'
                ? 'Discover balanced reporting across politics, technology, business, and culture'
                : '发现政治、科技、商业和文化领域的平衡报道'}
            </p>
            <button
              onClick={() => navigate('/news')}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--news-indigo)] text-white rounded-lg font-semibold hover:bg-[var(--news-vermillion)] transition-colors"
            >
              {language === 'en' ? 'Enter NewsGist' : '进入新闻摘要'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--news-indigo)]/10 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            {language === 'en' 
              ? '© 2026 NewsGist. Presenting multiple perspectives, understanding the world.'
              : '© 2026 NewsGist. 多元视角 · 理解世界'}
          </p>
        </div>
      </footer>
    </div>
  );
}
