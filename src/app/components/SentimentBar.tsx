import { motion } from 'motion/react';

interface SentimentBarProps {
  score: number;
}

export default function SentimentBar({ score }: SentimentBarProps) {
  const getColor = (value: number) => {
    if (value > 1) return 'var(--news-jade)';
    if (value > 0) return 'var(--news-amber)';
    if (value < -1) return 'var(--news-vermillion)';
    return 'var(--muted-foreground)';
  };

  const getLabel = (value: number) => {
    if (value >= 2) return 'Very Positive';
    if (value > 0) return 'Positive';
    if (value === 0) return 'Neutral';
    if (value > -2) return 'Negative';
    return 'Very Negative';
  };

  const percentage = ((score + 3) / 6) * 100;

  return (
    <div className="w-full">
      <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, var(--news-vermillion), var(--muted-foreground), var(--news-jade))'
          }}
        />

        {/* Indicator */}
        <motion.div
          initial={{ left: '50%' }}
          animate={{ left: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
          style={{ transform: 'translateX(-50%)' }}
        >
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[var(--news-indigo)] text-white text-xs px-3 py-1.5 rounded whitespace-nowrap shadow-lg">
            <div style={{ fontWeight: 600 }}>{score > 0 ? '+' : ''}{score}</div>
            <div className="text-[0.65rem] opacity-80">{getLabel(score)}</div>
            <div
              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[var(--news-indigo)] rotate-45"
            />
          </div>
        </motion.div>
      </div>

      <div className="flex justify-between mt-2 text-xs text-[var(--muted-foreground)]">
        <span>-3 (Very Negative)</span>
        <span>0 (Neutral)</span>
        <span>+3 (Very Positive)</span>
      </div>
    </div>
  );
}
