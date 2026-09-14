import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import Home from '@/pages/home';
import MaintenancePlanning from '@/pages/maintenance-planning';
import Network from '@/pages/network';
import Analytics from '@/pages/analytics';
import Assets from '@/pages/assets';
import Alerts from '@/pages/alerts';
import Reports from '@/pages/reports';
import ReportDetail from '@/pages/report-detail';
import AiAssistant from '@/pages/ai-assistant';
import Settings from '@/pages/settings';
import NotFound from '@/pages/not-found';
import { RailzenWorkspaceProvider } from '@/components/railzen-workspace';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/maintenance" component={MaintenancePlanning} />
        <Route path="/network" component={Network} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/assets" component={Assets} />
        <Route path="/alerts" component={Alerts} />
        <Route path="/reports/:id" component={ReportDetail} />
        <Route path="/reports" component={Reports} />
        <Route path="/ai-assistant" component={AiAssistant} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RailzenWorkspaceProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
          </WouterRouter>
        </RailzenWorkspaceProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
