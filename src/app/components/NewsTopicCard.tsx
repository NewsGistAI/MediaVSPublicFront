import { AlertCircle } from 'lucide-react';

interface NewsTopic {
  id: number;
  title: string;
  titleZh: string;
  category: string;
  controversy: number;
}

interface NewsTopicCardProps {
  topic: NewsTopic;
  isSelected: boolean;
  onClick: () => void;
}

export default function NewsTopicCard({ topic, isSelected, onClick }: NewsTopicCardProps) {
  const getControversyColor = (score: number) => {
    if (score >= 4) return 'var(--news-vermillion)';
    if (score >= 3) return 'var(--news-amber)';
    return 'var(--news-jade)';
  };

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
          style={{ fontSize: '0.75rem' }}
        >
          {topic.category}
        </span>
        <div className="flex items-center gap-1">
          <AlertCircle
            className="w-3 h-3"
            style={{ color: isSelected ? 'white' : getControversyColor(topic.controversy) }}
          />
          <span
            className="text-xs"
            style={{
              fontWeight: 600,
              color: isSelected ? 'white' : getControversyColor(topic.controversy)
            }}
          >
            {topic.controversy}/5
          </span>
        </div>
      </div>

      <h3
        style={{
          fontSize: '0.95rem',
          fontWeight: 600,
          marginBottom: '0.25rem',
          lineHeight: 1.3
        }}
      >
        {topic.title}
      </h3>

      <p
        className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}
        style={{ fontFamily: 'Noto Serif SC, serif', fontSize: '0.8rem' }}
      >
        {topic.titleZh}
      </p>
    </button>
  );
}
