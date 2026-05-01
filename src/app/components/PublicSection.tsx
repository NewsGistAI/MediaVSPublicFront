import { useState } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

interface UserComment {
  id: number;
  text: string;
  likes: number;
  platform: string;
  author: string;
}

interface PublicSectionProps {
  summary: string;
  commentCount: number;
  positivity: number;   // 0-100
  likes: number;
  comments?: UserComment[];
}

function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    'weibo': '📱',
    'toutiao': '📰',
    'xiaohongshu': '📕',
    'zhihu': '💭'
  };
  return icons[platform] || '💬';
}

export default function PublicSection({ summary, comments }: PublicSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  // Calculate pagination
  const totalPages = comments ? Math.ceil(comments.length / commentsPerPage) : 0;
  const startIndex = (currentPage - 1) * commentsPerPage;
  const endIndex = startIndex + commentsPerPage;
  const currentComments = comments ? comments.slice(startIndex, endIndex) : [];

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="bg-white rounded-xl border border-[var(--news-vermillion)]/20 p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Summary */}
      <div className="mb-6 p-4 bg-[var(--news-cream)] rounded-lg border-l-4 border-[var(--news-vermillion)]">
        <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--foreground)' }}>
          {summary}
        </p>
      </div>

      {/* User Comments Section with Pagination */}
      {comments && comments.length > 0 && (
        <div>
          <h4 className="font-serif text-lg font-bold text-[var(--news-vermillion)] mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Top Comments
          </h4>
          <div className="space-y-3 mb-4">
            {currentComments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="p-4 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getPlatformIcon(comment.platform)}</span>
                    <span className="text-xs font-semibold text-gray-700">@{comment.author}</span>
                    <span className="text-xs text-gray-400 capitalize">{comment.platform}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-2 line-clamp-2">
                  {comment.text}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Heart className="w-3 h-3" />
                  <span>{formatNumber(comment.likes)} likes</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-[var(--news-vermillion)] hover:bg-[var(--news-vermillion)]/10'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-[var(--news-vermillion)] hover:bg-[var(--news-vermillion)]/10'
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
