import { Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';

interface NavigationProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const categories = [
  { id: 'all', label: 'All Topics', labelZh: '全部' },
  { id: 'Politics', label: 'Politics', labelZh: '政治' },
  { id: 'Business', label: 'Business', labelZh: '商业' },
  { id: 'Technology', label: 'Technology', labelZh: '科技' },
  { id: 'Environment', label: 'Environment', labelZh: '环境' },
  { id: 'Health', label: 'Health', labelZh: '健康' },
  { id: 'Society', label: 'Society', labelZh: '社会' },
  { id: 'Culture', label: 'Culture', labelZh: '文化' },
  { id: 'History', label: 'History', labelZh: '历史' }
];

export default function Navigation({ selectedCategory, onCategoryChange, searchQuery, onSearchChange }: NavigationProps) {
  return (
    <nav className="bg-white border-b-2 border-[var(--news-indigo)]">
      <div className="max-w-[1800px] mx-auto px-8 py-4">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search news topics... 搜索新闻主题..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[var(--news-cream)] border-2 border-transparent rounded-lg focus:border-[var(--news-indigo)] focus:outline-none transition-colors"
              style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-[var(--muted-foreground)] mr-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm" style={{ fontWeight: 500 }}>Filter:</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-wrap">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                onClick={() => onCategoryChange(category.id)}
                className={`px-4 py-2 rounded-lg border-2 whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-[var(--news-indigo)] text-white border-[var(--news-indigo)] shadow-md'
                    : 'bg-white text-[var(--news-indigo)] border-gray-300 hover:border-[var(--news-indigo)] hover:shadow-sm'
                }`}
                style={{ fontSize: '0.875rem', fontWeight: 500 }}
              >
                <span>{category.label}</span>
                <span className="ml-2 opacity-70 text-xs">{category.labelZh}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
}
