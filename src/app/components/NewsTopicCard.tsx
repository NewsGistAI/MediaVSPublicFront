import { Newspaper, MessageCircle } from 'lucide-react';

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
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
        isSelected
          ? 'bg-[var(--news-indigo)] border-[var(--news-indigo)] text-white shadow-lg scale-105'
          : 'bg-white border-gray-200 hover:border-[var(--news-indigo)] hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <span
          className={`text-xs px-2 py-1 rounded ${
            isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {topic.category}
        </span>
      </div>

      <h3
        style={{
          fontFamily: 'Noto Serif SC, serif',
          fontSize: '0.95rem',
          fontWeight: 600,
          marginBottom: '0.5rem',
          lineHeight: 1.4
        }}
      >
        {topic.topic}
      </h3>

      <div className={`flex items-center gap-4 text-xs ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
        <span className="flex items-center gap-1">
          <Newspaper className="w-3 h-3" />
          {topic.news_count} 篇报道
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="w-3 h-3" />
          {topic.comment_count} 条评论
        </span>
      </div>
    </button>
  );
}
