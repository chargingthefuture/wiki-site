import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Flame } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ArticleCard } from "@/components/ArticleCard";
import { ARTICLES } from "@/lib/articles";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(ARTICLES.map(a => a.category)))];

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || article.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center border-b-8 border-black overflow-hidden comic-shadow">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Cityscape ruins" 
            className="w-full h-full object-cover grayscale-[30%] opacity-80 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          <div className="absolute inset-0 bg-halftone opacity-40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-heading font-bold uppercase tracking-widest border-2 border-black mb-6 comic-shadow-sm transform -rotate-1">
              <Flame size={18} fill="currentColor" />
              <span>Survivor Network</span>
            </div>
            
            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl text-white uppercase leading-[0.9] mb-6 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]" style={{WebkitTextStroke: '2px black', textShadow: '4px 4px 0 #000'}}>
              Exit Their Economy. <br/>
              <span className="text-primary drop-shadow-[0_0_15px_rgba(204,34,0,0.8)]">Exit The Psyop.</span>
            </h1>
            
            <p className="font-sans text-xl sm:text-2xl text-gray-200 mb-10 max-w-2xl border-l-4 border-accent pl-6 bg-black/40 p-4 backdrop-blur-sm">
              Critical transmissions, guides, and updates for the world's first psyop-free economy built exclusively for human trafficking survivors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Controls: Search & Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between bg-card p-4 sm:p-6 border-4 border-black comic-shadow-sm">
          
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search transmissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border-2 border-gray-700 text-white font-sans pl-12 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all rounded-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 font-heading font-bold uppercase tracking-wider text-sm border-2 transition-all ${
                  activeCategory === cat 
                    ? "bg-accent text-black border-black comic-shadow-sm translate-y-[-2px]" 
                    : "bg-black text-gray-400 border-gray-800 hover:border-gray-500 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredArticles.map((article, idx) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <ArticleCard article={article} index={idx} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-4 border-dashed border-gray-800 bg-card">
            <h3 className="font-display text-4xl text-gray-500 mb-4">No Transmissions Found</h3>
            <p className="font-sans text-gray-400">Try adjusting your search parameters.</p>
          </div>
        )}
      </section>
    </Layout>
  );
}
