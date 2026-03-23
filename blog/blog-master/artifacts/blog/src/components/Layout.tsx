import { Link } from "wouter";
import { Button } from "./Button";
import { Menu, X, Skull } from "lucide-react";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b-4 border-black comic-shadow-sm">
        <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <img 
                src={`${import.meta.env.BASE_URL}images/logo-mark.png`} 
                alt="Charging The Future Logo" 
                className="w-12 h-12 rounded-full border-2 border-primary grayscale group-hover:grayscale-0 transition-all duration-300"
              />
              <div className="flex flex-col">
                <span className="font-display text-2xl tracking-widest text-white leading-none" style={{WebkitTextStroke: '1px black', textShadow: '2px 2px 0 #000'}}>CHARGING THE FUTURE</span>
                <span className="font-heading text-xs uppercase tracking-widest text-primary font-bold">Live, Work & Prevail</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="font-heading font-bold text-lg uppercase hover:text-primary transition-colors">
                Transmissions
              </Link>
              <a href="https://chargingthefuture.com" target="_blank" rel="noopener noreferrer" className="font-heading font-bold text-lg uppercase hover:text-primary transition-colors">
                About
              </a>
              <Button onClick={() => window.location.href = "https://app.chargingthefuture.com"} variant="primary">
                Join The App
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-white hover:text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <nav className="md:hidden border-t-4 border-black bg-card p-4 flex flex-col gap-4">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="font-heading font-bold text-xl uppercase block p-2 border-b-2 border-gray-800">
              Transmissions (Blog)
            </Link>
            <a href="https://chargingthefuture.com" target="_blank" rel="noopener noreferrer" className="font-heading font-bold text-xl uppercase block p-2 border-b-2 border-gray-800">
              About Platform
            </a>
            <Button className="w-full mt-4" onClick={() => window.location.href = "https://app.chargingthefuture.com"}>
              Join The App
            </Button>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black border-t-8 border-primary relative overflow-hidden mt-20">
        <div className="absolute inset-0 bg-halftone-primary opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Skull className="text-primary" size={32} />
                <span className="font-display text-4xl tracking-widest text-white" style={{WebkitTextStroke: '1px black', textShadow: '2px 2px 0 #000'}}>CTF</span>
              </div>
              <p className="text-gray-400 font-sans text-lg max-w-md mb-6 border-l-4 border-primary pl-4">
                We exist to prevent human trafficking and its harms by building a sustainable, ethical marketplace that restores agency, heals survivors, and enables all people to thrive.
              </p>
              <h4 className="font-heading font-bold text-white text-xl uppercase tracking-widest mb-2">
                World's First Psyop-Free TI Economy
              </h4>
            </div>
            
            <div>
              <h3 className="font-heading text-2xl uppercase font-bold text-primary mb-6 border-b-2 border-gray-800 pb-2 inline-block">Resources</h3>
              <ul className="space-y-3 font-sans font-medium">
                <li><Link href="/" className="hover:text-white text-gray-400 transition-colors flex items-center gap-2"><span className="text-primary">▸</span> Transmissions</Link></li>
                <li><a href="https://chargingthefuture.com" className="hover:text-white text-gray-400 transition-colors flex items-center gap-2"><span className="text-primary">▸</span> Main Site</a></li>
                <li><a href="https://github.com/chargingthefuture/chargingthefuture/wiki" className="hover:text-white text-gray-400 transition-colors flex items-center gap-2"><span className="text-primary">▸</span> GitHub Wiki</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading text-2xl uppercase font-bold text-primary mb-6 border-b-2 border-gray-800 pb-2 inline-block">Action</h3>
              <p className="text-gray-400 mb-6 font-sans">
                Ready to exit their economy and exit the psyop?
              </p>
              <Button onClick={() => window.location.href = "https://app.chargingthefuture.com"} variant="accent" className="w-full">
                Apply For Access
              </Button>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t-2 border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 font-mono text-sm">
              &copy; {new Date().getFullYear()} Charging The Future. All rights reserved.
            </p>
            <p className="text-gray-600 font-mono text-sm uppercase tracking-widest">
              Live, Work & Prevail
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
