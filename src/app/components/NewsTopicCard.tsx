import { Newspaper, MessageCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface NewsTopic {
  id: number;
  topic: string;
  category: string;
  news_count: number;
  comment_count: number;
}

interface NewsTopicCardProps {
  topic: NewsTopic;
  isSelected: boolean;
  onClick: () => void;
}

export default function NewsTopicCard({ topic, isSelected, onClick }: NewsTopicCardProps) {
  const { lang, t } = useLanguage();
  const isEn = lang === 'en';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-300 ${
        isSelected
          ? 'bg-[var(--news-indigo)] border-[var(--news-indigo)] text-white shadow-md scale-[1.02]'
          : 'bg-white border-gray-200 hover:border-[var(--news-indigo)] hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded ${
            isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {topic.category}
        </span>
      </div>

      <h3
        className="line-clamp-2"
        style={{
          fontFamily: isEn ? 'Crimson Pro, serif' : 'Noto Serif SC, serif',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '0.25rem',
          lineHeight: 1.35
        }}
      >
        {topic.topic}
      </h3>

      <div className={`flex items-center gap-3 text-[10px] ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
        <span className="flex items-center gap-0.5">
          <Newspaper className="w-2.5 h-2.5" />
          {topic.news_count} {t('articles')}
        </span>
        <span className="flex items-center gap-0.5">
          <MessageCircle className="w-2.5 h-2.5" />
          {topic.comment_count} {t('comments')}
        </span>
      </div>
    </button>
  );
}
