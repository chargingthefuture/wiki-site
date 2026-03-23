export interface ArticleMeta {
  slug: string;
  title: string;
  repo: string;
  date: string;
  excerpt: string;
  category: string;
  featured?: boolean;
}

export const ARTICLES: ArticleMeta[] = [
  { 
    slug: "Home", 
    title: "Charging The Future | Live, Work & Prevail", 
    repo: "chargingthefuture/chargingthefuture", 
    date: "2025-12-31",
    excerpt: "An invite-only platform designed for human trafficking survivors, offering essential services and support with dignity, privacy, and respect.",
    category: "Foundation",
    featured: true
  },
  { 
    slug: "Weekly-State-of-the-TI-Skills-Economy", 
    title: "Weekly State of the TI Skills Economy", 
    repo: "chargingthefuture/mono", 
    date: "2026-03-22",
    excerpt: "The latest updates on platform uptime, waitlists, and new features designed to empower the community.",
    category: "Updates",
    featured: true
  },
  { 
    slug: "Contribution-Reversal,-A-Better-Alternative", 
    title: "Contribution Reversal: A Better Alternative", 
    repo: "chargingthefuture/chargingthefuture", 
    date: "2026-03-15",
    excerpt: "A reversal of our previous announcement. We are keeping the contribution ask low. When hosting costs aren't covered, the app goes down gracefully.",
    category: "Updates"
  },
  { 
    slug: "Getting-Started", 
    title: "Getting Started: Sign Up in ~5 Minutes", 
    repo: "chargingthefuture/mono", 
    date: "2026-01-03",
    excerpt: "Learn how to join the TI Skills Economy, securely verify your identity, and access 12+ essential services.",
    category: "Guides"
  },
  { 
    slug: "The-12-Services-of-the-TI-Skills-Economy", 
    title: "The 12 Services of the TI Skills Economy", 
    repo: "chargingthefuture/mono", 
    date: "2026-01-03",
    excerpt: "From housing (LightHouse) to job search (Workforce Recruiter), explore the robust toolkit built for survivors.",
    category: "Platform"
  },
  { 
    slug: "EXIT-THEIR-ECONOMY,-EXIT-THE-PSYOP", 
    title: "Exit Their Economy, Exit The Psyop", 
    repo: "chargingthefuture/mono", 
    date: "2026-01-03",
    excerpt: "Understanding the necessity of detaching from exploitative systems to build our own sustainable, ethical marketplace.",
    category: "Philosophy",
    featured: true
  },
  { 
    slug: "How-you-can-help", 
    title: "How You Can Help", 
    repo: "chargingthefuture/mono", 
    date: "2026-01-03",
    excerpt: "Ways to contribute to the TI Skills Economy, whether through mutual aid, sharing skills, or funding.",
    category: "Community"
  },
  { 
    slug: "verified-profiles", 
    title: "What Is a Verified Profile?", 
    repo: "chargingthefuture/mono", 
    date: "2026-01-03",
    excerpt: "How we maintain safety in our invite-only ecosystem by verifying authentic survivor profiles.",
    category: "Security"
  },
  { 
    slug: "TSE-Baseline", 
    title: "TSE Baseline Explained", 
    repo: "chargingthefuture/mono", 
    date: "2026-01-03",
    excerpt: "The fundamental operational standards and agreements that keep our community secure.",
    category: "Platform"
  },
  { 
    slug: "Time-to-live-free", 
    title: "How to Live Free", 
    repo: "chargingthefuture/mono", 
    date: "2026-01-03",
    excerpt: "Actionable steps to reclaim agency, restore dignity, and navigate life outside exploitative structures.",
    category: "Philosophy"
  },
  { 
    slug: "TIs-in-need-of-work,-try-clinical-trials", 
    title: "Clinical Trials for TIs", 
    repo: "chargingthefuture/mono", 
    date: "2026-01-03",
    excerpt: "An alternative income strategy for those struggling with traditional employment.",
    category: "Resources"
  },
  { 
    slug: "Peer‐to‐Peer-Crisis-Hotline", 
    title: "Peer-to-Peer Crisis Hotline", 
    repo: "chargingthefuture/mono", 
    date: "2026-01-03",
    excerpt: "Details on our mutual aid crisis support system, built by and for the community.",
    category: "Services"
  },
  { 
    slug: "Signal-Groups", 
    title: "List of All Chat Groups", 
    repo: "chargingthefuture/mono", 
    date: "2026-01-03",
    excerpt: "Secure end-to-end encrypted communication channels categorized by interest and need.",
    category: "Community"
  },
  { 
    slug: "Chyme:-TI-social-audio-app", 
    title: "Town Hall: 24-Hour Room (Chyme)", 
    repo: "chargingthefuture/mono", 
    date: "2026-01-03",
    excerpt: "Join the continuous social audio drop-in space for real-time connection and support.",
    category: "Services"
  },
  { 
    slug: "What-is-SupportMatch%3F", 
    title: "What Is SupportMatch?", 
    repo: "chargingthefuture/mono", 
    date: "2026-01-03",
    excerpt: "Find accountability partners and allies through our trauma-informed matching service.",
    category: "Services"
  }
];

// Helper to extract a clean URL component
export const getArticleUrl = (repo: string, slug: string) => {
  const shortRepo = repo.split('/')[1] || repo;
  return `/article/${shortRepo}/${slug}`;
};
