import { motion } from 'motion/react';

interface ControversyMeterProps {
  score: number;
}

export default function ControversyMeter({ score }: ControversyMeterProps) {
  const getColor = (level: number) => {
    if (score >= level) {
      if (level >= 4) return 'var(--news-vermillion)';
      if (level >= 3) return 'var(--news-amber)';
      return 'var(--news-jade)';
    }
    return '#e5e7eb';
  };

  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((level) => (
        <motion.div
          key={level}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: level * 0.1, duration: 0.3 }}
          className="relative group"
        >
          <div
            className="w-6 rounded-sm transition-all duration-300 group-hover:scale-110"
            style={{
              height: `${level * 8 + 16}px`,
              backgroundColor: getColor(level)
            }}
          />
          {score === level && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-[var(--news-indigo)] text-white text-[10px] px-2 py-1 rounded whitespace-nowrap"
              style={{ fontWeight: 600 }}
            >
              {level}/5
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
