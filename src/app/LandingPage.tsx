import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Globe2, TrendingUp, ArrowRight, Newspaper, MessageCircle, Languages } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import sampleData from '../../sample_topics.json';

export default function LandingPage() {
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const isEn = lang === 'en';

  const featuredTopics = sampleData.topics.slice(0, 2).map((raw: any, i: number) => {
    const topic = isEn ? raw.en_topic : raw.zh_topic;
    const newsList = isEn ? (raw.en_news_list || []) : (raw.zh_news_list || []);
    const commentList = isEn ? (raw.en_comment_list || []) : (raw.zh_comment_list || []);
    return {
      id: i + 1,
      topic,
      news_count: raw.news_count,
      comment_count: raw.comment_count,
      firstNewsTitle: newsList[0]?.title || '',
      firstComment: commentList[0]?.content || '',
    };
  });

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
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(isEn ? 'zh' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--news-indigo)]/20 bg-white hover:bg-[var(--news-indigo)]/5 transition-colors text-sm"
            >
              <Languages className="w-3.5 h-3.5 text-[var(--news-indigo)]" />
              <span className={`${!isEn ? 'font-bold text-[var(--news-indigo)]' : 'text-[var(--muted-foreground)]'}`}>中</span>
              <span className="text-[var(--muted-foreground)]">/</span>
              <span className={`${isEn ? 'font-bold text-[var(--news-indigo)]' : 'text-[var(--muted-foreground)]'}`}>EN</span>
            </button>
            <button
              onClick={() => navigate('/news')}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--news-indigo)] text-white rounded-lg hover:bg-[var(--news-indigo)]/90 transition-colors text-sm font-medium"
            >
              {t('browseAll')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: isEn ? 'Crimson Pro, serif' : 'Noto Serif SC, serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              color: 'var(--news-indigo)',
              lineHeight: 1.3,
              marginBottom: '1.5rem'
            }}
          >
            {t('heroTitle')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: isEn ? 'IBM Plex Sans, sans-serif' : 'Noto Serif SC, serif',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
              color: 'var(--foreground)',
              lineHeight: 1.6,
              maxWidth: '700px',
              margin: '0 auto'
            }}
          >
            {t('heroSubtitle')}
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
                  fontFamily: isEn ? 'Crimson Pro, serif' : 'Noto Serif SC, serif',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--news-indigo)',
                  lineHeight: 1.3,
                  marginBottom: '1rem'
                }}>
                  {news.topic}
                </h3>
                <div className="flex items-center gap-6 text-sm text-[var(--muted-foreground)]">
                  <span className="flex items-center gap-1"><Newspaper className="w-4 h-4" />{news.news_count} {t('articles')}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" />{news.comment_count} {t('comments')}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--news-indigo)]/10 border-t border-[var(--news-indigo)]/10">
                <div className="bg-white p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe2 className="w-4 h-4 text-[var(--news-indigo)]" />
                    <h4 className="font-serif text-sm font-bold text-[var(--news-indigo)] tracking-wider">{t('officialMedia')}</h4>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{news.firstNewsTitle}</p>
                </div>
                <div className="bg-white p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-[var(--news-vermillion)]" />
                    <h4 className="font-serif text-sm font-bold text-[var(--news-vermillion)] tracking-wider">{t('publicVoice')}</h4>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                    {news.firstComment || t('noComments')}
                  </p>
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
            <h3 style={{ fontFamily: isEn ? 'Crimson Pro, serif' : 'Noto Serif SC, serif', fontSize: '1.75rem', fontWeight: 700, color: 'var(--news-indigo)', marginBottom: '1rem' }}>
              {t('exploreMore')}
            </h3>
            <p className="text-gray-600 mb-6" style={{ lineHeight: 1.7 }}>
              {t('exploreDesc')}
            </p>
            <button
              onClick={() => navigate('/news')}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--news-indigo)] text-white rounded-lg font-semibold hover:bg-[var(--news-vermillion)] transition-colors"
            >
              {t('enterApp')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-[var(--news-indigo)]/10 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            {t('copyright')}
          </p>
        </div>
      </footer>
    </div>
  );
}
