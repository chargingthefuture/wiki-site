import { Link } from "wouter";
import { type ArticleMeta } from "@/lib/articles";
import { estimateReadTime } from "@/lib/utils";
import { ArrowRight, Clock, Calendar, ShieldAlert } from "lucide-react";
import { getArticleUrl } from "@/lib/articles";

export function ArticleCard({ article, index }: { article: ArticleMeta, index: number }) {
  const url = getArticleUrl(article.repo, article.slug);
  const readTime = estimateReadTime(article.excerpt.length * 20); // rough fake multiplier for card display
  
  // Alternate rotation for comic book feel
  const rotationClass = index % 2 === 0 ? "sm:hover:-rotate-2" : "sm:hover:rotate-2";

  return (
    <Link href={url} className={`block h-full group ${rotationClass} transition-transform duration-300 origin-center`}>
      <article className="comic-panel h-full flex flex-col relative overflow-hidden bg-card comic-panel-hover">
        {/* Halftone texture overlay */}
        <div className="absolute inset-0 bg-halftone opacity-30 pointer-events-none mix-blend-overlay"></div>
        
        {/* Top Accent Bar */}
        <div className="h-4 w-full bg-primary border-b-4 border-black shrink-0"></div>
        
        <div className="p-6 md:p-8 flex flex-col flex-grow relative z-10">
          
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent text-black font-heading font-bold text-sm uppercase tracking-wider border-2 border-black">
              {article.featured && <ShieldAlert size={14} className="text-black" />}
              {article.category}
            </span>
            <div className="flex items-center text-gray-400 font-mono text-xs gap-3">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {readTime} min
              </span>
            </div>
          </div>

          <h3 className="text-2xl md:text-3xl font-heading font-bold text-white uppercase leading-tight mb-4 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          
          <p className="text-gray-300 font-sans mb-8 flex-grow line-clamp-3">
            {article.excerpt}
          </p>
          
          <div className="mt-auto pt-4 border-t-4 border-dashed border-gray-800 flex items-center justify-between">
            <span className="font-heading text-lg text-primary uppercase font-bold group-hover:underline decoration-4 underline-offset-4">
              Read Transmission
            </span>
            <div className="w-10 h-10 bg-black border-2 border-white rounded-full flex items-center justify-center text-white group-hover:bg-primary group-hover:border-black group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:shadow-[4px_4px_0_0_#fff] transition-all">
              <ArrowRight size={20} strokeWidth={3} />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
