import { Link } from "wouter";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";
import { SeMark } from "./SeMark";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
              <SeMark size={40} className="shrink-0" />
              <div className="flex flex-col">
                <span className="font-display text-lg sm:text-2xl text-white leading-none font-medium tracking-wide whitespace-nowrap">CHARGING THE FUTURE</span>
                <span className="font-display italic text-xs sm:text-sm text-primary whitespace-nowrap mt-0.5">Exit their economy, exit the psyop.</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="font-heading font-bold text-lg uppercase hover:text-primary transition-colors">
                Transmissions
              </Link>
              <Link href="/feed" className="font-heading font-bold text-lg uppercase hover:text-primary transition-colors">
                The Feed
              </Link>
              <Link href="/record" className="font-heading font-bold text-lg uppercase hover:text-primary transition-colors">
                The Record
              </Link>
              <a href="https://chargingthefuture.com" target="_blank" rel="noopener noreferrer" className="font-heading font-bold text-lg uppercase hover:text-primary transition-colors">
                About
              </a>
              <Button onClick={() => window.location.href = "https://app.chargingthefuture.com"} variant="primary">
                Join The App
              </Button>
              <ThemeToggle />
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
          <nav className="md:hidden border-t border-border bg-card p-4 flex flex-col gap-4">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="font-heading font-bold text-xl uppercase block p-2 border-b-2 border-border">
              Transmissions (Blog)
            </Link>
            <Link href="/feed" onClick={() => setIsMenuOpen(false)} className="font-heading font-bold text-xl uppercase block p-2 border-b-2 border-border">
              The Feed
            </Link>
            <Link href="/record" onClick={() => setIsMenuOpen(false)} className="font-heading font-bold text-xl uppercase block p-2 border-b-2 border-border">
              The Record
            </Link>
            <a href="https://chargingthefuture.com" target="_blank" rel="noopener noreferrer" className="font-heading font-bold text-xl uppercase block p-2 border-b border-border">
              About Platform
            </a>
            <Button className="w-full mt-4" onClick={() => window.location.href = "https://app.chargingthefuture.com"}>
              Join The App
            </Button>
            <div className="mt-2">
              <ThemeToggle />
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-primary relative overflow-hidden mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <SeMark size={36} />
                <span className="font-display text-4xl text-white font-medium">CTF</span>
              </div>
              <p className="text-gray-400 font-sans text-lg max-w-md mb-6 border-l-2 border-primary pl-4">
                We exist to prevent human trafficking and its harms by building a sustainable, ethical marketplace that restores agency, heals survivors, and enables all people to thrive.
              </p>
              <h4 className="font-display text-white text-xl mb-2 font-medium">
                World's First Psyop-Free TI Economy
              </h4>
            </div>
            
            <div>
              <h3 className="font-display text-2xl text-primary mb-6 border-b border-border pb-2 inline-block font-medium">Resources</h3>
              <ul className="space-y-3 font-sans font-medium">
                <li><Link href="/" className="hover:text-white text-gray-400 transition-colors flex items-center gap-2"><span className="text-primary">▸</span> Transmissions</Link></li>
                <li><Link href="/feed" className="hover:text-white text-gray-400 transition-colors flex items-center gap-2"><span className="text-primary">▸</span> The Feed</Link></li>
                <li><Link href="/record" className="hover:text-white text-gray-400 transition-colors flex items-center gap-2"><span className="text-primary">▸</span> The Record</Link></li>
                <li><Link href="/streams" className="hover:text-white text-gray-400 transition-colors flex items-center gap-2"><span className="text-primary">▸</span> The Streams</Link></li>
                {/* A plain <a>, not a route: the feed is a static file the build
                    writes, and BASE_URL keeps it right under the /chargingthefuture/
                    path on Pages. A reader that already has a feed app takes this in
                    one press; anybody else can ignore it. */}
                <li><a href={`${import.meta.env.BASE_URL}feed.xml`} className="hover:text-white text-gray-400 transition-colors flex items-center gap-2"><span className="text-primary">▸</span> Follow by RSS</a></li>
                <li><a href="https://chargingthefuture.com" target="_blank" rel="noopener noreferrer" className="hover:text-white text-gray-400 transition-colors flex items-center gap-2"><span className="text-primary">▸</span> Main Site</a></li>
                <li><a href="https://github.com/chargingthefuture/wiki-site" target="_blank" rel="noopener noreferrer" className="hover:text-white text-gray-400 transition-colors flex items-center gap-2"><span className="text-primary">▸</span> Source &amp; History (GitHub)</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-display text-2xl text-primary mb-6 border-b border-border pb-2 inline-block font-medium">Action</h3>
              <p className="text-gray-400 mb-6 font-sans">
                Ready to exit their economy and exit the psyop?
              </p>
              <Button onClick={() => window.location.href = "https://chargingthefuture.com"} variant="accent" className="w-full">
                Sign up, free
              </Button>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 font-mono text-sm">
              &copy; {new Date().getFullYear()} Charging The Future. All rights reserved.
            </p>
            <p className="text-gray-600 font-mono text-sm">
              Exit their economy, exit the psyop.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
