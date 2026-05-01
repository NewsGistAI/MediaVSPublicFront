import { motion } from 'motion/react';
import { Newspaper, ExternalLink } from 'lucide-react';

export interface NewsArticle {
  title: string;
  url: string;
  published_at: string;
  source: string;
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
};

function getMediaColor(name: string): string {
  return mediaColors[name] || 'var(--news-indigo)';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export default function MediaSection({ articles }: MediaSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border-2 border-[var(--news-indigo)] p-8 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--news-indigo)', color: 'white' }}>
          <Newspaper className="w-6 h-6" />
        </div>
        <div>
          <h3 style={{ fontFamily: 'Crimson Pro, serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--news-indigo)' }}>
            媒体报道
          </h3>
          <p className="text-sm text-[var(--muted-foreground)]">{articles.length} 篇相关报道</p>
        </div>
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
            <div
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-white text-xs font-semibold whitespace-nowrap"
              style={{ backgroundColor: getMediaColor(article.source), minWidth: '80px', textAlign: 'center' }}
            >
              {article.source}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[var(--foreground)] leading-relaxed group-hover:text-[var(--news-indigo)] transition-colors" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                {article.title}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-[var(--muted-foreground)]">{formatDate(article.published_at)}</span>
                <ExternalLink className="w-3 h-3 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
