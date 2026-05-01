import { motion } from 'motion/react';
import { Building2, Newspaper, Users } from 'lucide-react';
import SentimentBar from './SentimentBar';

interface Perspective {
  country: string;
  flag: string;
  officialStance: string;
  mediaVoice: string;
  netizens: string;
  sentiment: number;
}

interface PerspectiveViewProps {
  perspective: Perspective;
}

export default function PerspectiveView({ perspective }: PerspectiveViewProps) {
  const sections = [
    {
      icon: Building2,
      title: 'Official Stance',
      titleZh: '官方立场',
      content: perspective.officialStance,
      color: 'var(--news-indigo)',
      delay: 0
    },
    {
      icon: Newspaper,
      title: 'Media Voice',
      titleZh: '媒体声音',
      content: perspective.mediaVoice,
      color: 'var(--news-vermillion)',
      delay: 0.1
    },
    {
      icon: Users,
      title: 'Netizens',
      titleZh: '网民观点',
      content: perspective.netizens,
      color: 'var(--news-jade)',
      delay: 0.2
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border-2 border-[var(--news-indigo)] p-8 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-200">
        <div className="flex items-center gap-4">
          <span className="text-6xl">{perspective.flag}</span>
          <div>
            <h3 style={{
              fontFamily: 'Crimson Pro, serif',
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--news-indigo)'
            }}>
              {perspective.country}
            </h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Perspective Analysis
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[var(--muted-foreground)] mb-2">SENTIMENT SCORE</div>
          <SentimentBar score={perspective.sentiment} />
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: section.delay, duration: 0.4 }}
            className="group"
          >
            <div className="flex items-start gap-4">
              <div
                className="p-3 rounded-lg transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${section.color}20` }}
              >
                <section.icon className="w-6 h-6" style={{ color: section.color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-2">
                  <h4 style={{
                    fontFamily: 'Crimson Pro, serif',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: section.color
                  }}>
                    {section.title}
                  </h4>
                  <span
                    className="text-sm"
                    style={{ fontFamily: 'Noto Serif SC, serif', color: 'var(--muted-foreground)' }}
                  >
                    {section.titleZh}
                  </span>
                </div>
                <p
                  className="text-[var(--foreground)] leading-relaxed"
                  style={{ fontSize: '0.95rem', lineHeight: 1.7 }}
                >
                  {section.content}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Decorative Element */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-8 pt-6 border-t-2 border-gray-200"
      >
        <div className="flex items-center justify-center gap-2 text-xs text-[var(--muted-foreground)]">
          <span>Analysis based on official statements, media coverage, and social media sentiment</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
