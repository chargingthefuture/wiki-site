import {
  Home,
  Car,
  Briefcase,
  Users,
  BookOpen,
  Radio,
  MessageSquare,
  MessageCircle,
  Headphones,
  Mic,
} from "lucide-react"

const services = [
  { icon: Home, name: "LightHouse", category: "Housing", description: "Safe accommodations and support resources" },
  {
    icon: Car,
    name: "TrustTransport",
    category: "Transportation",
    description: "Safe rides to appointments and errands",
  },
  {
    icon: Briefcase,
    name: "Workforce Recruiter",
    category: "Job Search",
    description: "Find career opportunities",
  },
  { icon: Users, name: "SupportMatch", category: "Accountability", description: "Accountability partners for mutual support" },
  { icon: BookOpen, name: "Directory", category: "Skill Sharing", description: "Build genuine professional connections" },
  { icon: Radio, name: "SocketRelay", category: "Mutual Aid", description: "Community-driven resource sharing" },
  { icon: Headphones, name: "GentlePulse", category: "Wellness", description: "Guided meditations" },
  { icon: Mic, name: "Chyme", category: "Social Audio", description: "Social audio with authentic people" },
]

export function ServicesSection() {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-secondary border-b-[6px] border-foreground" aria-labelledby="services-heading">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-block relative">
            {/* Comic burst effect */}
            <div className="absolute inset-0 bg-accent transform rotate-3 -z-10 scale-110" />
            <div className="bg-foreground text-background px-4 py-2 sm:px-6 sm:py-3 md:px-10 md:py-5 border-[4px] border-foreground relative">
              <h2 id="services-heading" className="font-[var(--font-bangers)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wide">8+ SERVICES</h2>
            </div>
          </div>
          <p className="font-[var(--font-inter)] text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base md:text-lg mt-4 sm:mt-6 md:mt-8">
            Access multiple essential services through a single secure
            account.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 border-[4px] border-foreground bg-background" role="list" aria-label="Available services">
          {services.map((service, index) => (
            <div
              key={service.name}
              className="p-3 sm:p-4 md:p-6 border-[2px] border-foreground transition-all group"
              role="listitem"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 sm:mb-3 md:mb-4 p-2 sm:p-2.5 md:p-3 border-[3px] border-foreground bg-card group-hover:bg-accent-foreground group-hover:text-accent transition-colors" aria-hidden="true">
                  <service.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
                <span className="font-[var(--font-bangers)] text-xs sm:text-sm md:text-base lg:text-lg mb-0.5 sm:mb-1">{service.name}</span>
                <span className="font-[var(--font-inter)] text-[10px] sm:text-xs text-muted-foreground group-hover:text-accent-foreground/80 uppercase tracking-wider">
                  {service.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
