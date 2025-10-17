import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { SocketProvider } from "./contexts/SocketContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { TooltipProvider } from "@/components/ui/tooltip";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Network from "./pages/Network";
import Notifications from "./pages/Notifications";
import Messaging from "./pages/Messaging";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Business from "./pages/Business";
import NotFound from "./pages/NotFound";
import PostPage from "./pages/PostPage";
import AuthCallback from "./pages/AuthCallback";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

const Root = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/Home" /> : <Landing />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Root />} />

                {/* Add the new auth callback route here */}
                <Route path="/auth/callback" element={<AuthCallback />} />

                <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/jobs"
                  element={
                    <ProtectedRoute>
                      <Jobs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/network"
                  element={
                    <ProtectedRoute>
                      <Network />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/messaging"
                  element={
                    <ProtectedRoute>
                      <Messaging />
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/messaging/:userId"
                  element={
                    <ProtectedRoute>
                      <Messaging />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:email"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/business"
                  element={
                    <ProtectedRoute>
                      <Business />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/post/:id"
                  element={
                    <ProtectedRoute>
                      <PostPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;