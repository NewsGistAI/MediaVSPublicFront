import { motion } from 'motion/react';
import { Newspaper, ExternalLink } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export interface NewsArticle {
  title: string;
  url: string;
  published_at: string;
  source: string;
  sourceIcon?: string | null;
}

interface MediaSectionProps {
  articles: NewsArticle[];
}

const mediaColors: Record<string, string> = {
  '新华网': '#c84b31',
  '经济参考报': '#c84b31',
  '人民网': '#d4380d',
  '央视网': '#1e3a5f',
  '中国网': '#2a9d8f',
  '国际在线': '#e76f51',
  '中国日报': '#264653',
  '中国青年网': '#f4a261',
  '光明网': '#6366f1',
  '央广网': '#059669',
  '中国经济网': '#0891b2',
  '中新网': '#7c3aed',
  // English names
  'Xinhua': '#c84b31',
  "People's Daily": '#d4380d',
  'CCTV': '#1e3a5f',
  'CGTN': '#1e3a5f',
  'China.org': '#2a9d8f',
  'CRI Online': '#e76f51',
  'China Daily': '#264653',
  'China Youth': '#f4a261',
  'Guangming': '#6366f1',
  'CNR': '#059669',
  'China Economic Net': '#0891b2',
  'China News': '#7c3aed',
  'Sina': '#d97706',
  'Tencent': '#2563eb',
  'Toutiao': '#ef4444',
  'NetEase': '#dc2626',
};

// Fallback icon map for articles without pre-resolved sourceIcon
const mediaIcons: Record<string, string> = {
  '新华网': 'xinhua',
  '经济参考报': 'xinhua',
  '人民网': 'people',
  '央视网': 'cctv',
  'CGTN': 'cgtn',
  '中国网': 'china',
  '国际在线': 'cri',
  '中国日报': 'chinadaily',
  '中国青年网': 'youth',
  '光明网': 'gmw',
  '央广网': 'cnr',
  '中国经济网': 'ce',
  '中新网': 'chinanews',
  '新浪': 'sina',
  '新浪网': 'sina',
  '腾讯': 'tencent',
  '腾讯网': 'tencent',
  '今日头条': 'toutiao',
  '头条': 'toutiao',
  '网易': 'netease',
  '网易网': 'netease',
  'Xinhua': 'xinhua',
  "People's Daily": 'people',
  'CCTV': 'cctv',
  'China.org': 'china',
  'CRI Online': 'cri',
  'China Daily': 'chinadaily',
  'China Youth': 'youth',
  'Guangming': 'gmw',
  'CNR': 'cnr',
  'China Economic Net': 'ce',
  'China News': 'chinanews',
  'Sina': 'sina',
  'Tencent': 'tencent',
  'Toutiao': 'toutiao',
  'NetEase': 'netease',
};

function getMediaColor(name: string): string {
  return mediaColors[name] || 'var(--news-indigo)';
}

function getIconUrl(article: NewsArticle): string | null {
  // Prefer pre-resolved sourceIcon from data layer
  if (article.sourceIcon) return article.sourceIcon;
  // Fallback to name-based mapping
  const slug = mediaIcons[article.source];
  return slug ? `/icon/${slug}.ico` : null;
}

function formatDate(dateStr: string, isEn: boolean): string {
  const date = new Date(dateStr);
  if (isEn) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  }
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export default function MediaSection({ articles }: MediaSectionProps) {
  const { lang, t } = useLanguage();
  const isEn = lang === 'en';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border-2 border-[var(--news-indigo)] p-8 shadow-xl"
    >
      <div className="flex items-center mb-6">
        <p className="text-sm text-[var(--muted-foreground)]">{articles.length} {t('relatedArticles')}</p>
      </div>

      <div className="space-y-3">
        {articles.map((article, index) => (
          <motion.a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="group flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300 block"
          >
            <div className="flex-shrink-0 flex items-center gap-2 min-w-[120px]">
              {getIconUrl(article) ? (
                <img
                  src={getIconUrl(article)!}
                  alt={article.source}
                  className="w-6 h-6 rounded object-contain flex-shrink-0"
                  loading="lazy"
                />
              ) : (
                <Newspaper
                  className="w-6 h-6 flex-shrink-0"
                  style={{ color: getMediaColor(article.source) }}
                />
              )}
              <span
                className="text-xs font-semibold whitespace-nowrap"
                style={{ color: getMediaColor(article.source) }}
              >
                {article.source}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[var(--foreground)] leading-relaxed group-hover:text-[var(--news-indigo)] transition-colors" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                {article.title}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-[var(--muted-foreground)]">{formatDate(article.published_at, isEn)}</span>
                <ExternalLink className="w-3 h-3 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
