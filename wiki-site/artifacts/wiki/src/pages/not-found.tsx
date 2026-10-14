import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Skull } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-2xl w-full text-center bg-card border border-border p-12 relative overflow-hidden">
          
          <div className="relative z-10">
            <Skull className="mx-auto text-primary mb-8" size={80} strokeWidth={1.5} />
            <h1 className="font-display text-8xl text-white mb-4 font-medium">404</h1>
            <h2 className="font-display text-3xl text-accent mb-6 border-b border-border pb-4 inline-block font-medium">
              Sector Not Found
            </h2>
            <p className="font-sans text-xl text-gray-300 mb-10 max-w-md mx-auto">
              You've wandered into a dead zone. The transmission you are looking for has been purged or never existed.
            </p>
            <Link href="/" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-heading uppercase tracking-wider text-xl border border-border hover:shadow-none transition-all">
              Return to Safe Zone
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
