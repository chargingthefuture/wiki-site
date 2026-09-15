import { Switch, Route, Redirect, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Article from "@/pages/Article";
import Feed from "@/pages/Feed";
import Record from "@/pages/Record";
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

function Router() {
  // Counts a view on every route, including the list surfaces. Inert unless
  // VITE_COUNTER_ENDPOINT is set; see src/lib/counter.ts for what it sends.
  useViewCounter();

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/feed" component={Feed} />
      <Route path="/record" component={Record} />
      <Route path="/peace-battle-2" component={PeaceBattleTwo} />
      {/* The short form, for saying out loud and typing on a phone. It resolves to the spelled-out
          address rather than serving the page at two URLs, so there is one address to link, to
          archive, and to share. */}
      <Route path="/pb2">{() => <Redirect to="/peace-battle-2" />}</Route>
      <Route path="/article/:repo/*" component={Article} />
      <Route component={NotFound} />
    </Switch>
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
