import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navigation from "./components/Navigation";
import SimpleNavigation from "./components/SimpleNavigation";
import Footer from "./components/Footer";
import ChatbotWidget from "./components/ChatbotWidget";
import ErrorBoundary from "./components/ErrorBoundary";

import LandingPage from "./pages/LandingPage";
import CoursesPage from "./pages/CoursesPage";
import LessonPage from "./pages/LessonPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import DevelopersPage from "./pages/DevelopersPage";
import TestPage from "./pages/TestPage";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "./contexts/AuthContext.simple";
import { ProgressProvider } from "./contexts/ProgressContext.simple";

const queryClient = new QueryClient();

const App = () => {
  console.log("App component rendering...");

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* Toasts for notifications */}
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <ErrorBoundary fallback={<div className="min-h-screen flex items-center justify-center"><div>Loading...</div></div>}>
              <AuthProvider>
                <ErrorBoundary fallback={<div className="min-h-screen flex items-center justify-center"><div>Loading progress...</div></div>}>
                  <ProgressProvider>
                    <div className="min-h-screen bg-background flex flex-col">
                      
                      {/* Top Navigation */}
                      <ErrorBoundary fallback={<SimpleNavigation />}>
                        <Navigation />
                      </ErrorBoundary>

                      {/* Main Content */}
                      <main className="flex-1">
                        <ErrorBoundary>
                          <Routes>
                            {/* ✅ All Main Routes */}
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/home" element={<LandingPage />} />
                            <Route path="/courses" element={<CoursesPage />} />
                            <Route path="/lesson/:courseId" element={<LessonPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/admin" element={<AdminPage />} />
                            <Route path="/developers" element={<DevelopersPage />} /> {/* ✅ Developer Info Page */}
                            <Route path="/test" element={<TestPage />} />

                            {/* ❌ 404 Catch-All */}
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </ErrorBoundary>
                      </main>

                      {/* Footer & Chatbot */}
                      <ErrorBoundary fallback={<div className="h-20 bg-muted/50" />}>
                        <Footer />
                      </ErrorBoundary>

                      <ErrorBoundary fallback={null}>
                        <ChatbotWidget />
                      </ErrorBoundary>
                    </div>
                  </ProgressProvider>
                </ErrorBoundary>
              </AuthProvider>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
