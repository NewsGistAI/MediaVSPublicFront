import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe2, TrendingUp, ArrowLeft, Search, Newspaper, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import NewsTopicCard from './components/NewsTopicCard';
import MediaSection from './components/MediaSection';
import type { NewsArticle } from './components/MediaSection';
import PublicSection from './components/PublicSection';
import type { PublicComment } from './components/PublicSection';
import sampleData from '../../sample_topics.json';

const SOURCE_MAP: Record<string, string> = {
  'xinhuanet.com': '新华网',
  'people.com.cn': '人民网',
  'cctv.com': '央视网',
  'china.com.cn': '中国网',
  'cri.cn': '国际在线',
  'chinadaily.com.cn': '中国日报',
  'youth.cn': '中国青年网',
  'gmw.cn': '光明网',
  'cnr.cn': '央广网',
  'ce.cn': '中国经济网',
  'chinanews.com.cn': '中新网',
  'sina.com.cn': '新浪',
};

function extractSource(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    for (const [domain, name] of Object.entries(SOURCE_MAP)) {
      if (hostname.endsWith(domain)) return name;
    }
    return hostname;
  } catch { return '未知来源'; }
}

function extractPlatform(url: string): string {
  if (url.includes('toutiao.com')) return 'toutiao';
  if (url.includes('sina.com')) return 'sina';
  if (url.includes('weibo.com')) return 'weibo';
  return 'other';
}

function detectCategory(topic: string): string {
  if (/贸易|自贸|关税|经济|商务/.test(topic)) return '经贸';
  if (/外长|侵略|军事|安全|战争|冲突/.test(topic)) return '国际';
  if (/出游|健康|旅游|假期|生活/.test(topic)) return '生活';
  if (/科技|AI|芯片|数字/.test(topic)) return '科技';
  return '时事';
}

function formatDateRange(articles: { published_at: string }[]): string {
  if (articles.length === 0) return '';
  const dates = articles.map(a => new Date(a.published_at)).sort((a, b) => a.getTime() - b.getTime());
  const earliest = dates[0];
  const latest = dates[dates.length - 1];
  const fmt = (d: Date) => `${d.getMonth() + 1}月${d.getDate()}日`;
  if (fmt(earliest) === fmt(latest)) return fmt(latest);
  return `${fmt(earliest)} - ${fmt(latest)}`;
}

interface NewsTopic {
  id: number;
  topic: string;
  category: string;
  news_count: number;
  comment_count: number;
  news_list: NewsArticle[];
  comment_list: PublicComment[];
  dateRange: string;
}

const newsTopics: NewsTopic[] = sampleData.topics.map((t, i) => {
  const articles: NewsArticle[] = t.news_list.map(n => ({
    title: n.title,
    url: n.url,
    published_at: n.published_at,
    source: extractSource(n.url),
  }));
  const comments: PublicComment[] = t.comment_list.map((c, ci) => ({
    id: ci + 1,
    content: c.content,
    user: c.user,
    news_url: c.news_url,
    platform: extractPlatform(c.news_url),
  }));
  return {
    id: i + 1,
    topic: t.topic,
    category: detectCategory(t.topic),
    news_count: t.news_count,
    comment_count: t.comment_count,
    news_list: articles,
    comment_list: comments,
    dateRange: formatDateRange(t.news_list),
  };
});

export default function App() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<NewsTopic>(newsTopics[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return newsTopics;
    const q = searchQuery.toLowerCase();
    return newsTopics.filter(t =>
      t.topic.toLowerCase().includes(q) ||
      t.category.includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[var(--news-cream)] overflow-hidden flex flex-col" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <header className="border-b border-[var(--news-indigo)]/10 bg-[var(--news-cream)] py-4 px-6 sticky top-0 z-40">
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
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder="搜索主题..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-[var(--news-indigo)]/20 rounded-full text-sm focus:outline-none focus:border-[var(--news-indigo)] w-64 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--news-vermillion)] bg-[var(--news-vermillion)]/10 px-3 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              <span>实时更新</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden max-w-[1800px] mx-auto w-full">
        <aside className="w-80 border-r border-[var(--news-indigo)]/10 bg-white/50 backdrop-blur-sm p-6 overflow-y-auto sticky top-[73px] h-[calc(100vh-73px)] hidden lg:block">
          <div className="mb-6">
            <h2 style={{ fontFamily: 'Noto Serif SC, serif', fontSize: '1.25rem', fontWeight: 600, color: 'var(--news-indigo)' }}>
              热门话题
            </h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">{filteredTopics.length} 个话题</p>
          </div>
          <div className="space-y-3">
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic) => (
                <NewsTopicCard
                  key={topic.id}
                  topic={topic}
                  isSelected={selectedTopic.id === topic.id}
                  onClick={() => setSelectedTopic(topic)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-[var(--muted-foreground)]">
                <p>未找到相关话题</p>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTopic.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="p-6 md:p-8 max-w-7xl mx-auto"
            >
              <div className="mb-8 border-b border-[var(--news-indigo)]/10 pb-6">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--news-jade)] text-white tracking-wider">
                    {selectedTopic.category}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)] font-medium">
                    {selectedTopic.dateRange}
                  </span>
                </div>
                <h2 style={{
                  fontFamily: 'Noto Serif SC, serif',
                  fontSize: '2.25rem',
                  fontWeight: 700,
                  color: 'var(--news-indigo)',
                  lineHeight: 1.3,
                  marginBottom: '1rem'
                }}>
                  {selectedTopic.topic}
                </h2>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                    <Newspaper className="w-4 h-4" />
                    <span>{selectedTopic.news_count} 篇媒体报道</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                    <MessageCircle className="w-4 h-4" />
                    <span>{selectedTopic.comment_count} 条公众评论</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
                <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--news-indigo)]/20 to-transparent -translate-x-1/2"></div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[var(--news-indigo)]/10 flex items-center justify-center">
                      <Globe2 className="w-4 h-4 text-[var(--news-indigo)]" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[var(--news-indigo)]">官方媒体</h3>
                  </div>
                  <MediaSection articles={selectedTopic.news_list} />
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[var(--news-vermillion)]/10 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-[var(--news-vermillion)]" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[var(--news-vermillion)]">公众声音</h3>
                  </div>
                  <PublicSection
                    commentCount={selectedTopic.comment_count}
                    comments={selectedTopic.comment_list}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
