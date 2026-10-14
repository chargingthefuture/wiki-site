import { useEffect, useRef } from "react";
import { Switch, Route, Redirect, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Article from "@/pages/Article";
import Feed from "@/pages/Feed";
import Record from "@/pages/Record";
import Streams from "@/pages/Streams";
import PeaceBattleTwo from "@/pages/PeaceBattleTwo";
import NotFound from "@/pages/not-found";
import { useViewCounter } from "@/hooks/use-counter";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  }
});

// A link to another page opens it at the top. The browser keeps the old scroll position on a
// client-side route change, so a post opened from far down the feed used to open at its bottom.
// Back and Forward are left alone, so the browser can return the reader to where they were, and
// an address with a #section still lands on that section.
function ScrollToTopOnNavigate() {
  const [location] = useLocation();
  const fromHistory = useRef(false);

  useEffect(() => {
    const onPop = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (fromHistory.current) {
      fromHistory.current = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0 });
  }, [location]);

  return null;
}

function Router() {
  // Counts a view on every route, including the list surfaces. Inert unless
  // VITE_COUNTER_ENDPOINT is set; see src/lib/counter.ts for what it sends.
  useViewCounter();

  return (
    <>
    <ScrollToTopOnNavigate />
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/feed" component={Feed} />
      <Route path="/record" component={Record} />
      <Route path="/streams" component={Streams} />
      <Route path="/peace-battle-2" component={PeaceBattleTwo} />
      {/* The short form, for saying out loud and typing on a phone. It resolves to the spelled-out
          address rather than serving the page at two URLs, so there is one address to link, to
          archive, and to share. */}
      <Route path="/pb2">{() => <Redirect to="/peace-battle-2" />}</Route>
      <Route path="/article/:repo/*" component={Article} />
      <Route component={NotFound} />
    </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
