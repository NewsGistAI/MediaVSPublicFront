import { useState, useMemo, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe2, TrendingUp, ArrowLeft, Search, ExternalLink, Languages } from 'lucide-react';
import { useNavigate } from 'react-router';
import NewsTopicCard from './components/NewsTopicCard';
import MediaSection from './components/MediaSection';
import PublicSection from './components/PublicSection';
import ControversyMeter from './components/ControversyMeter';

// Language Context
interface LanguageContextType {
  language: 'en' | 'zh';
  setLanguage: (lang: 'en' | 'zh') => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {}
});

export const useLanguage = () => useContext(LanguageContext);

interface MediaSource {
  name: string;
  opinion: string;
}

interface MediaView {
  summary: string;
  sources: MediaSource[];
}

interface PublicView {
  summary: string;
  commentCount: number;
  positivity: number;
  likes: number;
  comments?: UserComment[];
}

interface UserComment {
  id: number;
  text: string;
  likes: number;
  platform: string;
  author: string;
}

interface NewsTopic {
  id: number;
  title: string;
  titleZh: string;
  category: string;
  date: string;
  controversy: number;
  image: string;
  summary: string;
  media: MediaView;
  public: PublicView;
  sourceUrl?: string;
  hotness?: number; // For sorting by popularity
}

const newsTopics: NewsTopic[] = [
  {
    id: 1,
    title: "China's Tech Innovation Push",
    titleZh: "中国科技创新突破",
    category: "Technology",
    date: "April 23, 2026",
    controversy: 4,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop",
    summary: "China announces major breakthroughs in quantum computing and AI development, positioning itself as a global tech leader.",
    media: {
      summary: "Global media coverage highlights China's rapid advancements in quantum computing and AI, with varying degrees of emphasis on technological sovereignty and international competition.",
      sources: [
        { name: "Xinhua", opinion: "China's quantum computing breakthroughs mark a historic milestone in the nation's pursuit of technological self-reliance, demonstrating the effectiveness of long-term strategic investment in frontier science." },
        { name: "CGTN", opinion: "The achievements represent a new chapter in global tech leadership, with Chinese researchers contributing valuable innovations to the international scientific community." },
        { name: "People's Daily", opinion: "Under the guidance of national innovation strategy, Chinese scientists have made remarkable progress that strengthens the foundation for future technological development." },
        { name: "Reuters", opinion: "China's tech push intensifies global competition in quantum computing, raising questions about supply chain dependencies and international research collaboration frameworks." }
      ]
    },
    public: {
      summary: "Public reaction is largely enthusiastic, with national pride driving positive sentiment. Some voices call for more open international collaboration.",
      commentCount: 24500,
      positivity: 78,
      likes: 156000,
      comments: [
        { id: 1, text: "This is amazing progress! China is really leading in quantum computing now 🚀", likes: 3420, platform: "weibo", author: "TechEnthusiast88" },
        { id: 2, text: "Great to see our scientists making breakthroughs. Hope this benefits ordinary people too.", likes: 1856, platform: "toutiao", author: "CitizenZhang" },
        { id: 3, text: "But will this technology be accessible internationally? We need more open collaboration.", likes: 892, platform: "xiaohongshu", author: "GlobalThinker" },
        { id: 4, text: "Proud of our researchers! This shows the power of long-term investment in science.", likes: 2145, platform: "weibo", author: "ScienceFan2026" },
        { id: 5, text: "Hope this leads to practical applications soon, not just lab results.", likes: 567, platform: "zhihu", author: "PragmaticViewer" }
      ]
    },
    sourceUrl: "https://example.com/tech-innovation",
    hotness: 156000
  },
  {
    id: 2,
    title: "Belt and Road Initiative Expansion",
    titleZh: "一带一路倡议新阶段",
    category: "Business",
    date: "April 22, 2026",
    controversy: 5,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=450&fit=crop",
    summary: "New infrastructure projects announced across Southeast Asia and Africa as part of expanded Belt and Road Initiative.",
    media: {
      summary: "Coverage is polarized between highlighting economic development opportunities and raising concerns about debt sustainability and geopolitical influence.",
      sources: [
        { name: "Xinhua", opinion: "The expanded BRI projects demonstrate China's commitment to shared prosperity, bringing modern infrastructure and economic opportunities to developing nations." },
        { name: "CGTN", opinion: "New partnerships under BRI framework show growing trust between China and participating countries, with projects tailored to local development needs." },
        { name: "Global Times", opinion: "Western criticism of BRI reflects competitive anxiety rather than genuine concern for developing nations, which have overwhelmingly welcomed Chinese investment." },
        { name: "AP News", opinion: "Experts warn that some BRI partner countries face growing debt burdens, though supporters argue the infrastructure investments will generate long-term economic returns." }
      ]
    },
    public: {
      summary: "Public opinion is divided, with strong support domestically but mixed international reactions. Debates focus on economic impact and sovereignty concerns.",
      commentCount: 18700,
      positivity: 52,
      likes: 89000,
      comments: [
        { id: 1, text: "BRI brings real development to countries that need it. Western criticism is just jealousy.", likes: 2340, platform: "weibo", author: "PatrioticVoice" },
        { id: 2, text: "Concerned about debt sustainability. Hope there's better financial oversight.", likes: 1567, platform: "zhihu", author: "EconStudent" },
        { id: 3, text: "My cousin works on a BRI project in Africa. Says it's creating lots of local jobs!", likes: 1890, platform: "xiaohongshu", author: "GlobalCitizen" },
        { id: 4, text: "Infrastructure is important but transparency matters too. Need more details.", likes: 734, platform: "toutiao", author: "CriticalThinker" },
        { id: 5, text: "This is win-win cooperation. Developing nations welcome Chinese investment.", likes: 1456, platform: "weibo", author: "BusinessAnalyst" }
      ]
    },
    sourceUrl: "https://example.com/bri-expansion",
    hotness: 89000
  },
  {
    id: 3,
    title: "Environmental Protection Measures",
    titleZh: "生态文明建设新举措",
    category: "Environment",
    date: "April 21, 2026",
    controversy: 2,
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&h=450&fit=crop",
    summary: "China implements stringent new environmental regulations and expands green energy initiatives across major cities.",
    media: {
      summary: "Broadly positive media coverage recognizes China's growing commitment to environmental protection, while noting the challenge of balancing economic growth with sustainability.",
      sources: [
        { name: "Xinhua", opinion: "New environmental regulations demonstrate China's unwavering commitment to ecological civilization and sustainable development for future generations." },
        { name: "CGTN", opinion: "China's green energy expansion sets a global benchmark, with solar and wind capacity installations outpacing all other nations combined." },
        { name: "China Daily", opinion: "Local governments are embracing green transformation, with pilot cities showing remarkable improvements in air quality and biodiversity." },
        { name: "BBC", opinion: "China's environmental push is ambitious and shows real progress, though independent monitoring of enforcement remains limited in some regions." }
      ]
    },
    public: {
      summary: "Strong public support for environmental measures, with citizens expressing relief at improved air quality and green spaces in urban areas.",
      commentCount: 31200,
      positivity: 85,
      likes: 210000,
      comments: [
        { id: 1, text: "Finally! The air quality in Beijing has improved so much in recent years 🌱", likes: 4567, platform: "weibo", author: "BeijingResident" },
        { id: 2, text: "Green energy is the future. China is setting a great example for the world!", likes: 3890, platform: "xiaohongshu", author: "EcoWarrior" },
        { id: 3, text: "But we need to balance environmental protection with economic growth carefully.", likes: 1234, platform: "zhihu", author: "PolicyWatcher" },
        { id: 4, text: "My hometown has planted so many trees. The environment is visibly better!", likes: 2678, platform: "toutiao", author: "RuralVoice" },
        { id: 5, text: "Hope these policies continue long-term. Sustainability matters for our children.", likes: 1890, platform: "weibo", author: "FutureParent" }
      ]
    },
    sourceUrl: "https://example.com/environmental-protection",
    hotness: 210000
  },
  {
    id: 4,
    title: "Cultural Heritage Digitalization",
    titleZh: "文化遗产数字化保护",
    category: "Culture",
    date: "April 20, 2026",
    controversy: 1,
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=450&fit=crop",
    summary: "Major initiative launched to digitize and preserve ancient cultural artifacts and historical sites using advanced technology.",
    media: {
      summary: "Universally positive coverage celebrates the marriage of cutting-edge technology with cultural preservation, seen as a model for global heritage protection.",
      sources: [
        { name: "Xinhua", opinion: "The digitalization project represents a landmark effort to preserve thousands of years of Chinese civilization for future generations using AI and 3D scanning technology." },
        { name: "CGTN", opinion: "International museums and institutions express strong interest in collaboration, recognizing China's leadership in digital heritage preservation methods." },
        { name: "People's Daily", opinion: "From the Forbidden City to Dunhuang caves, digital preservation is making China's cultural treasures accessible to audiences worldwide." }
      ]
    },
    public: {
      summary: "Overwhelming public enthusiasm, with young people particularly excited about virtual reality tours of historical sites and interactive digital exhibits.",
      commentCount: 42800,
      positivity: 94,
      likes: 380000
    }
  },
  {
    id: 5,
    title: "Regional Security Cooperation",
    titleZh: "地区安全合作机制",
    category: "Politics",
    date: "April 19, 2026",
    controversy: 5,
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=450&fit=crop",
    summary: "New security framework proposed for Asia-Pacific region amid evolving geopolitical landscape.",
    media: {
      summary: "Highly contested coverage reflects deep divisions over the proposed security framework, with perspectives shaped by existing alliance structures and strategic interests.",
      sources: [
        { name: "Xinhua", opinion: "The proposed framework offers a path toward lasting regional stability based on mutual respect, non-interference, and collective security rather than military alliances." },
        { name: "CGTN", opinion: "Asian nations increasingly seek security arrangements that reflect regional realities rather than external power dynamics, making this proposal timely and relevant." },
        { name: "Global Times", opinion: "The Cold War mentality of certain external powers continues to undermine regional peace, making indigenous security solutions more necessary than ever." },
        { name: "Reuters", opinion: "The proposal has drawn sharp criticism from US allies in the region who view it as an attempt to weaken existing alliance networks and reduce American influence." }
      ]
    },
    public: {
      summary: "Public opinion is deeply divided along geopolitical lines, with heated online debates about the balance between sovereignty and alliance commitments.",
      commentCount: 15600,
      positivity: 38,
      likes: 67000
    }
  },
  {
    id: 6,
    title: "Traditional Medicine Integration",
    titleZh: "中医药现代化发展",
    category: "Health",
    date: "April 18, 2026",
    controversy: 3,
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&h=450&fit=crop",
    summary: "China promotes integration of traditional Chinese medicine with modern healthcare systems, expanding global reach.",
    media: {
      summary: "Coverage reflects ongoing tension between traditional medicine advocates and evidence-based medicine proponents, with increasing focus on scientific validation efforts.",
      sources: [
        { name: "Xinhua", opinion: "TCM modernization initiative combines ancient wisdom with cutting-edge research, producing clinically validated treatments that complement Western medicine." },
        { name: "CGTN", opinion: "Growing international acceptance of TCM is reflected in WHO recognition and increasing integration into healthcare systems across Asia and Europe." },
        { name: "China Daily", opinion: "New research centers are applying rigorous scientific methods to validate traditional remedies, bridging the gap between tradition and modern pharmacology." },
        { name: "NHK", opinion: "Japan's own traditional medicine (Kampo) system shows how Asian medical traditions can be successfully integrated with modern healthcare through evidence-based approaches." }
      ]
    },
    public: {
      summary: "Strong domestic support mixed with calls for more rigorous clinical trials. International public opinion ranges from curious interest to healthy skepticism.",
      commentCount: 19400,
      positivity: 65,
      likes: 124000
    }
  },
  {
    id: 7,
    title: "Urban-Rural Development Gap",
    titleZh: "城乡发展差距治理",
    category: "Society",
    date: "April 17, 2026",
    controversy: 2,
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=450&fit=crop",
    summary: "New policies aim to address widening urban-rural divide through infrastructure investment and digital connectivity.",
    media: {
      summary: "Thoughtful coverage examines the scale of the challenge and the ambition of proposed solutions, with comparisons to similar efforts in other developing nations.",
      sources: [
        { name: "Xinhua", opinion: "Common prosperity initiatives are delivering tangible results in rural areas, with digital infrastructure connecting previously isolated communities to economic opportunities." },
        { name: "CGTN", opinion: "The urban-rural digital bridge program has brought e-commerce and telemedicine to thousands of villages, transforming rural livelihoods." },
        { name: "People's Daily", opinion: "Success stories from pilot provinces demonstrate that targeted investment in education and infrastructure can effectively narrow the development gap." }
      ]
    },
    public: {
      summary: "Rural residents express cautious optimism about new programs, while urban citizens support initiatives but question funding priorities and implementation speed.",
      commentCount: 12300,
      positivity: 61,
      likes: 78000
    }
  },
  {
    id: 8,
    title: "Silk Road Archaeological Discovery",
    titleZh: "丝绸之路考古新发现",
    category: "History",
    date: "April 16, 2026",
    controversy: 1,
    image: "https://images.unsplash.com/photo-1461360370896-922624d12a74?w=800&h=450&fit=crop",
    summary: "Major archaeological excavation uncovers ancient trading post along Silk Road, revealing cross-cultural exchange evidence.",
    media: {
      summary: "Enthusiastic global coverage celebrates the archaeological significance of the discovery, which provides new evidence of ancient cross-cultural connections.",
      sources: [
        { name: "Xinhua", opinion: "The excavation reveals a remarkably preserved trading post dating to the Han Dynasty, with artifacts from Rome, Persia, and India confirming the Silk Road's role as humanity's first global network." },
        { name: "CGTN", opinion: "International archaeologists praise the discovery as one of the most significant Silk Road finds in decades, offering unprecedented insights into ancient trade patterns." },
        { name: "China Daily", opinion: "The site includes inscriptions in multiple ancient scripts, suggesting a cosmopolitan trading community that thrived on cultural exchange and mutual benefit." }
      ]
    },
    public: {
      summary: "Widespread fascination with the discovery, sparking renewed interest in Silk Road history and cultural heritage tourism.",
      commentCount: 35600,
      positivity: 96,
      likes: 420000
    }
  },
  {
    id: 9,
    title: "AI Ethics and Governance Framework",
    titleZh: "人工智能伦理治理",
    category: "Technology",
    date: "April 15, 2026",
    controversy: 3,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
    summary: "China proposes international AI governance framework emphasizing safety, ethics, and responsible development.",
    media: {
      summary: "Mixed coverage reflects differing perspectives on AI governance approaches, with debates centered on balancing innovation with regulation and differing value systems.",
      sources: [
        { name: "Xinhua", opinion: "China's AI governance framework prioritizes human welfare and safety, proposing practical international standards that balance innovation with responsible development." },
        { name: "CGTN", opinion: "The framework addresses critical concerns about AI bias, privacy, and autonomous systems, offering a comprehensive approach to governance that respects national sovereignty." },
        { name: "Global Times", opinion: "China's proactive stance on AI governance contrasts with the regulatory vacuum in some Western countries, demonstrating responsible technological leadership." },
        { name: "Reuters", opinion: "The proposed framework raises questions about compatibility with existing governance models and the balance between state oversight and innovation freedom." }
      ]
    },
    public: {
      summary: "Tech professionals show strong interest in governance details, while general public focuses on AI's impact on jobs and daily life.",
      commentCount: 21000,
      positivity: 55,
      likes: 98000
    }
  },
  {
    id: 10,
    title: "Youth Employment Initiatives",
    titleZh: "青年就业促进计划",
    category: "Society",
    date: "April 14, 2026",
    controversy: 2,
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=450&fit=crop",
    summary: "Government launches comprehensive program to address youth unemployment through skills training and entrepreneurship support.",
    media: {
      summary: "Sympathetic coverage highlights the universal challenge of youth employment, with analysis of program specifics and comparisons to international approaches.",
      sources: [
        { name: "Xinhua", opinion: "The comprehensive youth employment program provides vocational training, entrepreneurship funds, and job matching services, directly addressing the needs of college graduates." },
        { name: "CGTN", opinion: "Young entrepreneurs are finding new opportunities through government-supported incubators and digital economy platforms that didn't exist a decade ago." },
        { name: "People's Daily", opinion: "Local governments are creating targeted employment pathways in emerging industries including green energy, digital services, and advanced manufacturing." }
      ]
    },
    public: {
      summary: "Young people express cautious hope while emphasizing the need for structural reforms. Older generations show empathy and support for targeted interventions.",
      commentCount: 28900,
      positivity: 58,
      likes: 145000
    }
  }
];

export default function App() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<NewsTopic>(newsTopics[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [language, setLanguage] = useState<'en' | 'zh'>('en');

  const filteredTopics = useMemo(() => {
    let filtered = newsTopics;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(topic => topic.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(topic =>
        topic.title.toLowerCase().includes(query) ||
        topic.titleZh.includes(query) ||
        topic.summary.toLowerCase().includes(query) ||
        topic.category.toLowerCase().includes(query)
      );
    }

    // Sort by hotness by default since sorting controls are removed
    filtered = [...filtered].sort((a, b) => {
      return (b.hotness || 0) - (a.hotness || 0);
    });

    return filtered;
  }, [selectedCategory, searchQuery]);

  const handleTopicChange = (topic: NewsTopic) => {
    setSelectedTopic(topic);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const newFiltered = category === 'all'
      ? newsTopics
      : newsTopics.filter(t => t.category === category);

    if (newFiltered.length > 0) {
      setSelectedTopic(newFiltered[0]);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className="min-h-screen bg-[var(--news-cream)] overflow-hidden flex flex-col" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      {/* Header */}
      <header className="border-b border-[var(--news-indigo)]/10 bg-[var(--news-cream)] py-4 px-6 sticky top-0 z-40">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-[var(--news-indigo)]/5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--news-indigo)]" />
            </button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <Globe2 className="w-8 h-8 text-[var(--news-indigo)]" />
              <div>
                <h1 style={{ fontFamily: 'Crimson Pro, serif', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2, color: 'var(--news-indigo)' }}>NewsGist</h1>
              </div>
            </div>
          </div>
          
          {/* Simplified Navigation/Search */}
          <div className="flex items-center gap-6">
             {/* Language Toggle */}
             <button
               onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
               className="flex items-center gap-2 px-3 py-2 bg-white border border-[var(--news-indigo)]/20 rounded-lg hover:border-[var(--news-indigo)] transition-colors text-sm font-medium text-[var(--news-indigo)]"
             >
               <Languages className="w-4 h-4" />
               {language === 'en' ? '中文' : 'English'}
             </button>
             
             <div className="relative hidden md:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
               <input 
                 type="text" 
                 placeholder={language === 'en' ? "Search topics..." : "搜索主题..."}
                 value={searchQuery}
                 onChange={(e) => handleSearchChange(e.target.value)}
                 className="pl-9 pr-4 py-2 bg-white border border-[var(--news-indigo)]/20 rounded-full text-sm focus:outline-none focus:border-[var(--news-indigo)] w-64 transition-all"
               />
             </div>
             <div className="flex items-center gap-2 text-xs font-medium text-[var(--news-vermillion)] bg-[var(--news-vermillion)]/10 px-3 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              <span>{language === 'en' ? 'Live Updates' : '实时更新'}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden max-w-[1800px] mx-auto w-full">
        {/* Sidebar - Topics List (Refined) */}
        <aside className="w-80 border-r border-[var(--news-indigo)]/10 bg-white/50 backdrop-blur-sm p-6 overflow-y-auto sticky top-[73px] h-[calc(100vh-73px)] hidden lg:block">
          <div className="mb-6">
            <h2 style={{ fontFamily: 'Noto Serif SC, serif', fontSize: '1.25rem', fontWeight: 600, color: 'var(--news-indigo)' }}>
              {selectedCategory === 'all' ? (language === 'en' ? "Hot Topics" : "热门话题") : selectedCategory}
            </h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              {filteredTopics.length} {filteredTopics.length === 1 ? (language === 'en' ? 'topic' : '个话题') : (language === 'en' ? 'topics' : '个话题')}
            </p>
            
            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-2 mt-3">
              {['all', 'Politics', 'Technology', 'Business', 'Society', 'Environment', 'Health', 'Culture', 'History'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-[var(--news-indigo)] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? (language === 'en' ? 'All' : '全部') : 
                   cat === 'Politics' ? (language === 'en' ? 'Politics' : '政治') :
                   cat === 'Technology' ? (language === 'en' ? 'Tech' : '科技') :
                   cat === 'Business' ? (language === 'en' ? 'Business' : '商业') :
                   cat === 'Society' ? (language === 'en' ? 'Society' : '社会') :
                   cat === 'Environment' ? (language === 'en' ? 'Env' : '环境') :
                   cat === 'Health' ? (language === 'en' ? 'Health' : '健康') :
                   cat === 'Culture' ? (language === 'en' ? 'Culture' : '文化') :
                   cat === 'History' ? (language === 'en' ? 'History' : '历史') : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic) => (
                <NewsTopicCard
                  key={topic.id}
                  topic={topic}
                  isSelected={selectedTopic.id === topic.id}
                  onClick={() => handleTopicChange(topic)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-[var(--muted-foreground)]">
                <p>No topics found</p>
                <p className="text-xs mt-2">Try a different category or search term</p>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTopic.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="p-6 md:p-8 max-w-7xl mx-auto"
            >
              {/* Topic Header with Image - Horizontal Layout */}
              <div className="mb-8 border-b border-[var(--news-indigo)]/10 pb-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Text Content */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--news-jade)] text-white uppercase tracking-wider">
                        {selectedTopic.category}
                      </span>
                      <span className="text-xs text-[var(--muted-foreground)] font-medium">
                        {selectedTopic.date}
                      </span>
                      {selectedTopic.sourceUrl && (
                        <a
                          href={selectedTopic.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-[var(--news-indigo)] hover:text-[var(--news-vermillion)] transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Source
                        </a>
                      )}
                    </div>
                    
                    <h2 style={{
                      fontFamily: 'Crimson Pro, serif',
                      fontSize: '2.5rem',
                      fontWeight: 700,
                      color: 'var(--news-indigo)',
                      lineHeight: 1.2,
                      marginBottom: '1rem'
                    }}>
                      {language === 'en' ? selectedTopic.title : selectedTopic.titleZh}
                    </h2>
                    
                    <p style={{ color: 'var(--foreground)', lineHeight: 1.7, fontSize: '1rem' }} className="font-serif mb-4">
                      {selectedTopic.summary}
                    </p>

                    {/* Controversy Meter */}
                    <div className="flex items-center gap-4">
                       <div className="flex-1 max-w-md">
                          <div className="flex justify-between text-xs text-[var(--muted-foreground)] mb-2 uppercase tracking-wider font-semibold">
                            <span>{language === 'en' ? 'Controversy Level' : '争议度'} <span className="ml-2 text-[var(--news-indigo)]">{selectedTopic.controversy}/5</span></span>
                          </div>
                          <ControversyMeter score={selectedTopic.controversy} />
                       </div>
                    </div>
                  </div>

                  {/* Image - 16:9 Ratio */}
                  <div className="lg:col-span-1">
                    <div className="rounded-lg overflow-hidden shadow-lg border border-[var(--news-indigo)]/10" style={{ aspectRatio: '16/9' }}>
                      <img
                        src={selectedTopic.image}
                        alt={language === 'en' ? selectedTopic.title : selectedTopic.titleZh}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.style.background = 'linear-gradient(135deg, var(--news-indigo), var(--news-jade))';
                          target.parentElement!.style.display = 'flex';
                          target.parentElement!.style.alignItems = 'center';
                          target.parentElement!.style.justifyContent = 'center';
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dual Perspective Layout: Media vs Public */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
                {/* Visual Divider for Desktop */}
                <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--news-indigo)]/20 to-transparent -translate-x-1/2"></div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--news-indigo)]/10 flex items-center justify-center">
                        <Globe2 className="w-4 h-4 text-[var(--news-indigo)]" />
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-[var(--news-indigo)]">{language === 'en' ? 'Official Media' : '官方媒体'}</h3>
                    </div>
                  </div>
                  <MediaSection
                    summary={selectedTopic.media.summary}
                    sources={selectedTopic.media.sources}
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--news-vermillion)]/10 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-[var(--news-vermillion)]" />
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-[var(--news-vermillion)]">{language === 'en' ? 'Public Voice' : '公众声音'}</h3>
                    </div>
                  </div>
                  <PublicSection
                    summary={selectedTopic.public.summary}
                    commentCount={selectedTopic.public.commentCount}
                    positivity={selectedTopic.public.positivity}
                    likes={selectedTopic.public.likes}
                    comments={selectedTopic.public.comments}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      </div>
    </LanguageContext.Provider>
  );
}
