import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export interface PublicComment {
  id: number;
  content: string;
  user: string;
  news_url: string;
  platform: string;
}

interface PublicSectionProps {
  commentCount: number;
  comments: PublicComment[];
}

function getPlatformLabel(platform: string, t: (key: string) => string): string {
  const map: Record<string, string> = {
    'toutiao': t('platToutiao'),
    'sina': t('platSina'),
    'weibo': t('platWeibo'),
  };
  return map[platform] || t('platComment');
}

function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    'toutiao': '📰',
    'sina': '📱',
    'weibo': '📱',
  };
  return icons[platform] || '💬';
}

export default function PublicSection({ commentCount, comments }: PublicSectionProps) {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(100); // start large so we can measure
  const listRef = useRef<HTMLDivElement>(null);

  // Dynamically calculate how many comments fit in the available space
  const measure = useCallback(() => {
    const el = listRef.current;
    if (!el || comments.length === 0) return;

    const availableHeight = el.clientHeight;
    if (availableHeight <= 0) return;

    // Measure the first rendered comment card
    const card = el.querySelector('[data-comment]') as HTMLElement | null;
    if (!card) return;

    const cardHeight = card.offsetHeight;
    const gap = 12; // space-y-3 = 0.75rem = 12px
    const count = Math.max(1, Math.floor((availableHeight + gap) / (cardHeight + gap)));

    setPerPage(prev => (prev !== count ? count : prev));
  }, [comments.length]);

  // Re-measure whenever container resizes (e.g. mediaColHeight changes)
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  // Reset to page 1 when per-page count or comments change
  useEffect(() => { setCurrentPage(1); }, [perPage, comments]);

  const totalPages = Math.max(1, Math.ceil(comments.length / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * perPage;
  const currentComments = comments.slice(startIndex, startIndex + perPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="bg-white rounded-xl border border-[var(--news-vermillion)]/20 p-6 shadow-sm h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <span className="text-sm text-[var(--muted-foreground)]">
          {commentCount} {t('totalComments')}
        </span>
        {totalPages > 1 && (
          <span className="text-xs text-[var(--muted-foreground)]">
            {safePage} / {totalPages}
          </span>
        )}
      </div>

      {comments.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[var(--muted-foreground)]">
          <div className="text-center">
            <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">{t('noComments')}</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Comment list — ref for height measurement */}
          <div ref={listRef} className="flex-1 min-h-0 overflow-hidden space-y-3">
            {currentComments.map((comment, index) => (
              <motion.div
                key={comment.id}
                data-comment
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.25 }}
                className="p-4 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getPlatformIcon(comment.platform)}</span>
                  <span className="text-xs font-semibold text-gray-700">@{comment.user}</span>
                  <span className="text-xs text-gray-400">{getPlatformLabel(comment.platform, t)}</span>
                  <a href={comment.news_url} target="_blank" rel="noopener noreferrer" className="ml-auto">
                    <ExternalLink className="w-3 h-3 text-gray-400 hover:text-[var(--news-vermillion)] transition-colors" />
                  </a>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {comment.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Pagination — always at bottom */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  safePage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[var(--news-vermillion)] hover:bg-[var(--news-vermillion)]/10'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                {t('prevPage')}
              </button>
              <span className="text-sm text-gray-600">
                {safePage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  safePage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-[var(--news-vermillion)] hover:bg-[var(--news-vermillion)]/10'
                }`}
              >
                {t('nextPage')}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
