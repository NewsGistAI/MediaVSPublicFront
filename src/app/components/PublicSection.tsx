import { useState } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

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

function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    'toutiao': '头条',
    'sina': '新浪',
    'weibo': '微博',
  };
  return labels[platform] || '评论';
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
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;
  const totalPages = Math.ceil(comments.length / commentsPerPage);
  const startIndex = (currentPage - 1) * commentsPerPage;
  const currentComments = comments.slice(startIndex, startIndex + commentsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="bg-white rounded-xl border border-[var(--news-vermillion)]/20 p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[var(--news-vermillion)]" />
          <h4 className="font-serif text-lg font-bold text-[var(--news-vermillion)]">
            网友热评
          </h4>
        </div>
        <span className="text-sm text-[var(--muted-foreground)]">
          共 {commentCount} 条评论
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {currentComments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.3 }}
            className="p-4 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{getPlatformIcon(comment.platform)}</span>
              <span className="text-xs font-semibold text-gray-700">@{comment.user}</span>
              <span className="text-xs text-gray-400">{getPlatformLabel(comment.platform)}</span>
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[var(--news-vermillion)] hover:bg-[var(--news-vermillion)]/10'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            上一页
          </button>
          <span className="text-sm text-gray-600">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-[var(--news-vermillion)] hover:bg-[var(--news-vermillion)]/10'
            }`}
          >
            下一页
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
