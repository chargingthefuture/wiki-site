import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Skull } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-2xl w-full text-center bg-card border-8 border-black comic-shadow-primary p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-halftone opacity-30 pointer-events-none"></div>
          
          <div className="relative z-10">
            <Skull className="mx-auto text-primary mb-8" size={80} strokeWidth={1.5} />
            <h1 className="font-display text-8xl text-white mb-4" style={{WebkitTextStroke: '1px black', textShadow: '2px 2px 0 #000'}}>404</h1>
            <h2 className="font-heading text-3xl text-accent font-bold uppercase tracking-widest mb-6 border-b-4 border-black pb-4 inline-block">
              Sector Not Found
            </h2>
            <p className="font-sans text-xl text-gray-300 mb-10 max-w-md mx-auto">
              You've wandered into a dead zone. The transmission you are looking for has been purged or never existed.
            </p>
            <Link href="/" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-heading uppercase tracking-wider text-xl border-4 border-black comic-shadow-sm hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all">
              Return to Safe Zone
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
