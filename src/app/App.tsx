import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe2, TrendingUp, ArrowLeft, Search, Newspaper, MessageCircle, Languages } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useLanguage } from './LanguageContext';
import NewsTopicCard from './components/NewsTopicCard';
import MediaSection from './components/MediaSection';
import type { NewsArticle } from './components/MediaSection';
import PublicSection from './components/PublicSection';
import type { PublicComment } from './components/PublicSection';
import sampleData from '../../sample_topics.json';

// ─── Source extraction helpers ───────────────────────────────────

const SOURCE_MAP: Record<string, string> = {
  'xinhuanet.com': '新华网',
  'people.com.cn': '人民网',
  'cctv.com': '央视网',
  'china.com.cn': '中国网',
  'china.org.cn': '中国网',
  'cri.cn': '国际在线',
  'chinadaily.com.cn': '中国日报',
  'youth.cn': '中国青年网',
  'gmw.cn': '光明网',
  'cnr.cn': '央广网',
  'ce.cn': '中国经济网',
  'chinanews.com.cn': '中新网',
  'sina.com.cn': '新浪',
  'news.cn': '新华网',
};

const EN_SOURCE_MAP: Record<string, string> = {
  'xinhuanet.com': 'Xinhua',
  'people.com.cn': "People's Daily",
  'cctv.com': 'CCTV',
  'china.com.cn': 'China.org',
  'china.org.cn': 'China.org',
  'cri.cn': 'CRI Online',
  'chinadaily.com.cn': 'China Daily',
  'youth.cn': 'China Youth',
  'gmw.cn': 'Guangming',
  'cnr.cn': 'CNR',
  'ce.cn': 'China Economic Net',
  'chinanews.com.cn': 'China News',
  'sina.com.cn': 'Sina',
  'news.cn': 'Xinhua',
};

const ICON_TO_EN_NAME: Record<string, string> = {
  'xinhua.ico': 'Xinhua',
  'people.ico': "People's Daily",
  'cctv.ico': 'CCTV',
  'cgtn.ico': 'CGTN',
  'china.ico': 'China.org',
  'cri.ico': 'CRI Online',
  'chinadaily.ico': 'China Daily',
  'youth.ico': 'China Youth',
  'gmw.ico': 'Guangming',
  'gmw_en.ico': 'Guangming',
  'cnr.ico': 'CNR',
  'ce.ico': 'China Economic Net',
  'chinanews.ico': 'China News',
  'sina.ico': 'Sina',
  'tencent.ico': 'Tencent',
  'toutiao.ico': 'Toutiao',
  'netease.ico': 'NetEase',
};

function extractSourceFromUrl(url: string, map: Record<string, string>, fallback: string): string {
  try {
    const hostname = new URL(url).hostname;
    for (const [domain, name] of Object.entries(map)) {
      if (hostname.endsWith(domain)) return name;
    }
    return hostname;
  } catch { return fallback; }
}

function extractPlatform(url: string): string {
  if (url.includes('toutiao.com')) return 'toutiao';
  if (url.includes('sina.com')) return 'sina';
  if (url.includes('weibo.com')) return 'weibo';
  return 'other';
}

// Category detection always runs on Chinese topic
function detectCategoryKey(zhTopic: string): string {
  if (/贸易|自贸|关税|经济|商务/.test(zhTopic)) return 'catTrade';
  if (/外长|侵略|军事|安全|战争|冲突|总理|总统|选举|领导人|联合国/.test(zhTopic)) return 'catIntl';
  if (/出游|健康|旅游|假期|生活/.test(zhTopic)) return 'catLife';
  if (/科技|AI|芯片|数字/.test(zhTopic)) return 'catTech';
  if (/网球|大师赛|体育|连胜|冠军|赛事/.test(zhTopic)) return 'catLife';
  return 'catCurrent';
}

function formatDateRange(articles: { published_at: string }[], isEn: boolean): string {
  if (articles.length === 0) return '';
  const dates = articles.map(a => new Date(a.published_at)).sort((a, b) => a.getTime() - b.getTime());
  const earliest = dates[0];
  const latest = dates[dates.length - 1];
  if (isEn) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const fmt = (d: Date) => `${months[d.getMonth()]} ${d.getDate()}`;
    if (fmt(earliest) === fmt(latest)) return fmt(latest);
    return `${fmt(earliest)} - ${fmt(latest)}`;
  }
  const fmt = (d: Date) => `${d.getMonth() + 1}月${d.getDate()}日`;
  if (fmt(earliest) === fmt(latest)) return fmt(latest);
  return `${fmt(earliest)} - ${fmt(latest)}`;
}

// ─── Types ───────────────────────────────────────────────────────

interface NewsTopic {
  id: number;
  topic: string;
  summary: string;
  categoryKey: string;
  news_count: number;
  comment_count: number;
  news_list: NewsArticle[];
  comment_list: PublicComment[];
  dateRange: string;
  coverImage: string | null;
}

// ─── Component ───────────────────────────────────────────────────

export default function App() {
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const [selectedTopicId, setSelectedTopicId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [coverError, setCoverError] = useState<Record<number, boolean>>({});
  const mediaColRef = useRef<HTMLDivElement>(null);
  const [mediaColHeight, setMediaColHeight] = useState<number | null>(null);
  const isEn = lang === 'en';

  // Measure left (media) column height so right column can match
  useEffect(() => {
    const el = mediaColRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setMediaColHeight(el.offsetHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [selectedTopicId, lang]);

  const newsTopics: NewsTopic[] = useMemo(() => {
    return sampleData.topics.map((rawTopic: any, i: number) => {
      const zhTopic = rawTopic.zh_topic || '';
      const enTopic = rawTopic.en_topic || '';
      const topic = isEn ? enTopic : zhTopic;
      const summary = isEn ? (rawTopic.en_summary || '') : (rawTopic.zh_summary || '');

      // Build news articles based on language
      const rawNewsList = isEn ? (rawTopic.en_news_list || []) : (rawTopic.zh_news_list || []);
      const articles: NewsArticle[] = rawNewsList.map((n: any) => {
        let source: string;
        let sourceIcon: string | null = null;

        if (isEn) {
          // English mode
          if (n.source_icon) {
            source = ICON_TO_EN_NAME[n.source_icon] || n.source_icon.replace('.ico', '');
            sourceIcon = `/icon/${n.source_icon}`;
          } else {
            source = extractSourceFromUrl(n.url, EN_SOURCE_MAP, 'Unknown');
          }
        } else {
          // Chinese mode
          if (n.source?.name_zh) {
            source = n.source.name_zh;
            sourceIcon = n.source.icon ? `/icon/${n.source.icon}` : null;
          } else {
            source = extractSourceFromUrl(n.url, SOURCE_MAP, '未知来源');
          }
        }

        return {
          title: n.title,
          url: n.url,
          published_at: n.published_at,
          source,
          sourceIcon,
        };
      });

      // Build comments
      const rawCommentList = isEn ? (rawTopic.en_comment_list || []) : (rawTopic.zh_comment_list || []);
      const comments: PublicComment[] = rawCommentList.map((c: any, ci: number) => ({
        id: ci + 1,
        content: c.content,
        user: c.user,
        news_url: c.news_url || '',
        platform: c.news_url ? extractPlatform(c.news_url) : 'other',
      }));

      // Find cover image (try both lists)
      const allNews = [...(rawTopic.zh_news_list || []), ...(rawTopic.en_news_list || [])];
      const coverImage = allNews.find((n: any) => n.cover_img)?.cover_img || null;

      return {
        id: i + 1,
        topic,
        summary,
        categoryKey: detectCategoryKey(zhTopic),
        news_count: rawTopic.news_count,
        comment_count: rawTopic.comment_count,
        news_list: articles,
        comment_list: comments,
        dateRange: formatDateRange(rawNewsList, isEn),
        coverImage,
      };
    });
  }, [lang]);

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return newsTopics;
    const q = searchQuery.toLowerCase();
    return newsTopics.filter(tp =>
      tp.topic.toLowerCase().includes(q) ||
      t(tp.categoryKey).toLowerCase().includes(q)
    );
  }, [searchQuery, newsTopics, t]);

  const selectedTopic = useMemo(
    () => newsTopics.find(tp => tp.id === selectedTopicId) || newsTopics[0],
    [newsTopics, selectedTopicId]
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[var(--news-cream)]" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      {/* ─── Header: frozen ─── */}
      <header className="border-b border-[var(--news-indigo)]/10 bg-[var(--news-cream)] py-4 px-6 flex-shrink-0 z-40">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-[var(--news-indigo)]/5 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-[var(--news-indigo)]" />
            </button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <Globe2 className="w-8 h-8 text-[var(--news-indigo)]" />
              <h1 style={{ fontFamily: 'Crimson Pro, serif', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2, color: 'var(--news-indigo)' }}>NewsGist</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-[var(--news-indigo)]/20 rounded-full text-sm focus:outline-none focus:border-[var(--news-indigo)] w-64 transition-all"
              />
            </div>
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
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--news-vermillion)] bg-[var(--news-vermillion)]/10 px-3 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              <span>{t('liveUpdate')}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-[1800px] mx-auto w-full min-h-0">
        {/* ─── Sidebar: frozen, fills full height below header ─── */}
        <aside className="w-80 border-r border-[var(--news-indigo)]/10 bg-white/50 backdrop-blur-sm hidden lg:block flex-shrink-0 overflow-y-auto p-4">
          <div className="mb-3">
            <h2 style={{ fontFamily: 'Noto Serif SC, serif', fontSize: '1.1rem', fontWeight: 600, color: 'var(--news-indigo)' }}>
              {t('hotTopics')}
            </h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{filteredTopics.length} {t('topicCount')}</p>
          </div>
          <div className="space-y-1.5">
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic) => (
                <NewsTopicCard
                  key={topic.id}
                  topic={{ ...topic, category: t(topic.categoryKey) }}
                  isSelected={selectedTopic.id === topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-[var(--muted-foreground)]">
                <p>{t('noTopicsFound')}</p>
              </div>
            )}
          </div>
        </aside>

        {/* ─── Main Content: only this area scrolls ─── */}
        <main className="flex-1 min-w-0 overflow-y-auto scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedTopic.id}-${lang}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="p-6 md:p-8 max-w-7xl mx-auto"
            >
              {/* Topic Header — text left, cover image right */}
              <div className="mb-8 border-b border-[var(--news-indigo)]/10 pb-6">
                <div className="flex gap-8 items-start">
                  {/* Left: text content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--news-jade)] text-white tracking-wider">
                        {t(selectedTopic.categoryKey)}
                      </span>
                      <span className="text-xs text-[var(--muted-foreground)] font-medium">
                        {selectedTopic.dateRange}
                      </span>
                    </div>
                    <h2 style={{
                      fontFamily: isEn ? 'Crimson Pro, serif' : 'Noto Serif SC, serif',
                      fontSize: '2.25rem',
                      fontWeight: 700,
                      color: 'var(--news-indigo)',
                      lineHeight: 1.3,
                      marginBottom: '1rem'
                    }}>
                      {selectedTopic.topic}
                    </h2>

                    {/* Summary */}
                    {selectedTopic.summary && (
                      <p className="text-[var(--foreground)] leading-relaxed mb-4" style={{
                        fontSize: '0.95rem',
                        lineHeight: 1.8,
                        fontFamily: isEn ? 'IBM Plex Sans, sans-serif' : 'Noto Sans SC, sans-serif',
                      }}>
                        {selectedTopic.summary}
                      </p>
                    )}

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                        <Newspaper className="w-4 h-4" />
                        <span>{selectedTopic.news_count} {t('mediaReports')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                        <MessageCircle className="w-4 h-4" />
                        <span>{selectedTopic.comment_count} {t('publicComments')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: cover image 16:9 */}
                  {selectedTopic.coverImage && !coverError[selectedTopic.id] && (
                    <div className="hidden md:block flex-shrink-0 w-72 lg:w-80">
                      <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: '16 / 9' }}>
                        <img
                          src={selectedTopic.coverImage}
                          alt={selectedTopic.topic}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={() => setCoverError(prev => ({ ...prev, [selectedTopic.id]: true }))}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Two-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative items-start">
                <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--news-indigo)]/20 to-transparent -translate-x-1/2"></div>
                <div ref={mediaColRef} className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[var(--news-indigo)]/10 flex items-center justify-center">
                      <Globe2 className="w-4 h-4 text-[var(--news-indigo)]" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[var(--news-indigo)]">{t('officialMedia')}</h3>
                  </div>
                  <MediaSection articles={selectedTopic.news_list} />
                </div>
                <div className="flex flex-col space-y-6" style={mediaColHeight ? { height: mediaColHeight } : undefined}>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-[var(--news-vermillion)]/10 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-[var(--news-vermillion)]" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[var(--news-vermillion)]">{t('publicVoice')}</h3>
                  </div>
                  <div className="flex-1 min-h-0">
                    <PublicSection
                      commentCount={selectedTopic.comment_count}
                      comments={selectedTopic.comment_list}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
