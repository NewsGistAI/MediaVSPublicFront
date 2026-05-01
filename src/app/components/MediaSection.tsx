import { motion } from 'motion/react';
import { Newspaper, Quote } from 'lucide-react';

interface MediaSource {
  name: string;
  opinion: string;
}

interface MediaSectionProps {
  summary: string;
  sources: MediaSource[];
}

const mediaColors: Record<string, string> = {
  'Xinhua': '#c84b31',
  'CGTN': '#1e3a5f',
  'People\'s Daily': '#2a9d8f',
  'Global Times': '#e76f51',
  'China Daily': '#264653',
  'Reuters': '#f4a261',
  'AP News': '#1e3a5f',
  'BBC': '#c84b31',
  'NHK': '#2a9d8f',
};

function getMediaColor(name: string): string {
  return mediaColors[name] || 'var(--news-indigo)';
}

export default function MediaSection({ summary, sources }: MediaSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border-2 border-[var(--news-indigo)] p-8 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--news-indigo)', color: 'white' }}>
          <Newspaper className="w-6 h-6" />
        </div>
        <div>
          <h3 style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--news-indigo)'
          }}>
            The Media
          </h3>
          <p className="text-sm text-[var(--muted-foreground)]">媒体观点</p>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8 p-5 bg-[var(--news-cream)] rounded-xl border border-gray-200">
        <div className="flex items-start gap-3">
          <Quote className="w-5 h-5 text-[var(--news-vermillion)] mt-1 flex-shrink-0" />
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--foreground)' }}>
            {summary}
          </p>
        </div>
      </div>

      {/* Media Sources */}
      <div className="space-y-4">
        {sources.map((source, index) => (
          <motion.div
            key={source.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300"
          >
            {/* Media Badge */}
            <div
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-white text-xs font-semibold whitespace-nowrap"
              style={{ backgroundColor: getMediaColor(source.name), minWidth: '90px', textAlign: 'center' }}
            >
              {source.name}
            </div>
            {/* Opinion */}
            <p className="text-[var(--foreground)] leading-relaxed" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
              {source.opinion}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
