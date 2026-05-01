import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Globe2, TrendingUp, ArrowRight, Newspaper, MessageCircle } from 'lucide-react';
import sampleData from '../../sample_topics.json';

const featuredTopics = sampleData.topics.slice(0, 2).map((t, i) => ({
  id: i + 1,
  topic: t.topic,
  news_count: t.news_count,
  comment_count: t.comment_count,
  firstNewsTitle: t.news_list[0]?.title || '',
  firstComment: t.comment_list[0]?.content || '',
}));

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--news-cream)]" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <header className="border-b border-[var(--news-indigo)]/10 bg-[var(--news-cream)] py-4 px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/news')}>
            <Globe2 className="w-8 h-8 text-[var(--news-indigo)]" />
            <h1 style={{ fontFamily: 'Crimson Pro, serif', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2, color: 'var(--news-indigo)' }}>
              NewsGist
            </h1>
          </div>
          <button
            onClick={() => navigate('/news')}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--news-indigo)] text-white rounded-lg hover:bg-[var(--news-indigo)]/90 transition-colors text-sm font-medium"
          >
            浏览所有主题
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: 'Noto Serif SC, serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              color: 'var(--news-indigo)',
              lineHeight: 1.3,
              marginBottom: '1.5rem'
            }}
          >
            看见故事的多面性
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: 'Noto Serif SC, serif',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
              color: 'var(--foreground)',
              lineHeight: 1.6,
              maxWidth: '700px',
              margin: '0 auto'
            }}
          >
            官方媒体与公众声音的平衡呈现
          </motion.p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto space-y-12">
          {featuredTopics.map((news, index) => (
            <motion.article
              key={news.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-white rounded-xl border border-[var(--news-indigo)]/10 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/news')}
            >
              <div className="p-6 md:p-8">
                <h3 style={{
                  fontFamily: 'Noto Serif SC, serif',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--news-indigo)',
                  lineHeight: 1.3,
                  marginBottom: '1rem'
                }}>
                  {news.topic}
                </h3>
                <div className="flex items-center gap-6 text-sm text-[var(--muted-foreground)]">
                  <span className="flex items-center gap-1"><Newspaper className="w-4 h-4" />{news.news_count} 篇报道</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" />{news.comment_count} 条评论</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--news-indigo)]/10 border-t border-[var(--news-indigo)]/10">
                <div className="bg-white p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe2 className="w-4 h-4 text-[var(--news-indigo)]" />
                    <h4 className="font-serif text-sm font-bold text-[var(--news-indigo)] tracking-wider">官方媒体</h4>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{news.firstNewsTitle}</p>
                </div>
                <div className="bg-white p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-[var(--news-vermillion)]" />
                    <h4 className="font-serif text-sm font-bold text-[var(--news-vermillion)] tracking-wider">公众声音</h4>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{news.firstComment}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-[var(--news-cream)] to-white rounded-2xl p-8 md:p-12 border border-[var(--news-indigo)]/20"
          >
            <h3 style={{ fontFamily: 'Noto Serif SC, serif', fontSize: '1.75rem', fontWeight: 700, color: 'var(--news-indigo)', marginBottom: '1rem' }}>
              探索更多视角
            </h3>
            <p className="text-gray-600 mb-6" style={{ lineHeight: 1.7 }}>
              发现国际、经贸、生活等领域的多元报道与公众讨论
            </p>
            <button
              onClick={() => navigate('/news')}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--news-indigo)] text-white rounded-lg font-semibold hover:bg-[var(--news-vermillion)] transition-colors"
            >
              进入 NewsGist
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-[var(--news-indigo)]/10 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            © 2026 NewsGist. 多元视角 · 理解世界
          </p>
        </div>
      </footer>
    </div>
  );
}
