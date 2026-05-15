import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Lang = 'zh' | 'en';

const translations: Record<Lang, Record<string, string>> = {
  zh: {
    // Header / Navigation
    'browseAll': '浏览所有主题',
    'liveUpdate': '实时更新',
    'searchPlaceholder': '搜索主题...',

    // Landing Page
    'heroTitle': '看见故事的多面性',
    'heroSubtitle': '官方媒体与公众声音的平衡呈现',
    'exploreMore': '探索更多视角',
    'exploreDesc': '发现国际、经贸、生活等领域的多元报道与公众讨论',
    'enterApp': '进入 NewsGist',
    'copyright': '© 2026 NewsGist. 多元视角 · 理解世界',

    // App - Sidebar
    'hotTopics': '热门话题',
    'topicCount': '个话题',
    'noTopicsFound': '未找到相关话题',

    // App - Topic Detail
    'officialMedia': '官方媒体',
    'publicVoice': '公众声音',
    'mediaReports': '篇媒体报道',
    'publicComments': '条公众评论',

    // MediaSection
    'mediaCoverage': '媒体报道',
    'relatedArticles': '篇相关报道',

    // PublicSection
    'hotComments': '网友热评',
    'totalComments': '条评论',
    'prevPage': '上一页',
    'nextPage': '下一页',
    'noComments': '暂无评论',

    // NewsTopicCard
    'articles': '篇报道',
    'comments': '条评论',

    // Categories
    'catTrade': '经贸',
    'catIntl': '国际',
    'catLife': '生活',
    'catTech': '科技',
    'catCurrent': '时事',

    // Platforms
    'platToutiao': '头条',
    'platSina': '新浪',
    'platWeibo': '微博',
    'platComment': '评论',

    // Unknown source
    'unknownSource': '未知来源',
  },
  en: {
    'browseAll': 'Browse All Topics',
    'liveUpdate': 'Live Update',
    'searchPlaceholder': 'Search topics...',

    'heroTitle': 'See the Many Sides of Every Story',
    'heroSubtitle': 'A balanced view of official media and public voices',
    'exploreMore': 'Explore More Perspectives',
    'exploreDesc': 'Discover diverse coverage and public discussions across international affairs, trade, lifestyle and more',
    'enterApp': 'Enter NewsGist',
    'copyright': '© 2026 NewsGist. Multiple Perspectives · Understand the World',

    'hotTopics': 'Trending Topics',
    'topicCount': 'topics',
    'noTopicsFound': 'No matching topics found',

    'officialMedia': 'Official Media',
    'publicVoice': 'Public Voice',
    'mediaReports': 'media reports',
    'publicComments': 'public comments',

    'mediaCoverage': 'Media Coverage',
    'relatedArticles': 'related articles',

    'hotComments': 'Public Comments',
    'totalComments': 'comments',
    'prevPage': 'Previous',
    'nextPage': 'Next',
    'noComments': 'No comments yet',

    'articles': 'articles',
    'comments': 'comments',

    'catTrade': 'Trade',
    'catIntl': 'International',
    'catLife': 'Lifestyle',
    'catTech': 'Technology',
    'catCurrent': 'Current Affairs',

    'platToutiao': 'Toutiao',
    'platSina': 'Sina',
    'platWeibo': 'Weibo',
    'platComment': 'Comment',

    'unknownSource': 'Unknown',
  },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('newsgist-lang');
      if (saved === 'zh' || saved === 'en') return saved;
    } catch {}
    return 'zh';
  });

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    try { localStorage.setItem('newsgist-lang', newLang); } catch {}
  }, []);

  const t = useCallback((key: string): string => {
    return translations[lang][key] || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
