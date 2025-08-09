
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import SharedProjectDetail from "./pages/SharedProjectDetail";
import ConversationDetail from "./pages/ConversationDetail";
import Conversations from "./pages/Conversations";
import Prompting from "./pages/Prompting";
import Tools from "./pages/Tools";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import VerifySuccess from "./pages/VerifySuccess";
import NotFound from "./pages/NotFound";
import DocsPlaybook from "./pages/DocsPlaybook";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { initMixpanel } from '@/lib/analytics/mixpanel';
import PageTracker from '@/components/analytics/PageTracker';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry mutations on client errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 1;
      }
    }
  },
});

// Initialize Mixpanel if configured via localStorage or window
initMixpanel();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <AuthProvider>
        <TooltipProvider>
          <Sonner position="top-right" closeButton />
          <BrowserRouter>
            <PageTracker />
            {/* Subscription provider supplies plan and usage across the app */}
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <RootWithSubscription>
                      <Dashboard />
                    </RootWithSubscription>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <RootWithSubscription>
                      <Projects />
                    </RootWithSubscription>
                  </ProtectedRoute>
                }
              />
              <Route path="/projects/shared/:shareLink" element={<SharedProjectDetail />} />
              <Route
                path="/projects/:id"
                element={
                  <ProtectedRoute>
                    <RootWithSubscription>
                      <ProjectDetail />
                    </RootWithSubscription>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/conversations"
                element={
                  <ProtectedRoute>
                    <RootWithSubscription>
                      <Conversations />
                    </RootWithSubscription>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/conversations/:id"
                element={
                  <ProtectedRoute>
                    <RootWithSubscription>
                      <ConversationDetail />
                    </RootWithSubscription>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/prompting"
                element={
                  <ProtectedRoute>
                    <RootWithSubscription>
                      <Prompting />
                    </RootWithSubscription>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools"
                element={
                  <ProtectedRoute>
                    <RootWithSubscription>
                      <Tools />
                    </RootWithSubscription>
                  </ProtectedRoute>
                }
              />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/verify-success" element={<VerifySuccess />} />
              <Route
                path="/docs/playbook"
                element={
                  <ProtectedRoute>
                    <RootWithSubscription>
                      <DocsPlaybook />
                    </RootWithSubscription>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);

// Small wrapper to provide SubscriptionProvider only once around protected pages
const RootWithSubscription: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SubscriptionProvider>
      {children}
    </SubscriptionProvider>
  );
};

export default App;
