import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { GameProvider } from "./lib/gameContext";
import { ThemeProvider } from "./lib/theme-provider";
import { AuthProvider } from "./hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SplashScreen } from "@/components/splash-screen";
import { ProtectedRoute } from "@/components/protected-route";

import Home from "@/pages/home";
import Tasks from "@/pages/tasks";
import Focus from "@/pages/focus";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Home} />
      <ProtectedRoute path="/tasks" component={Tasks} />
      <ProtectedRoute path="/focus" component={Focus} />
      <ProtectedRoute path="/profile" component={Profile} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  
  // Check if this is first time loading or a refresh
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (hasSeenSplash) {
      setShowSplash(false);
    } else {
      // Set the flag so splash only shows once per session
      sessionStorage.setItem("hasSeenSplash", "true");
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <GameProvider>
            <TooltipProvider>
              {showSplash ? (
                <SplashScreen onComplete={() => setShowSplash(false)} />
              ) : (
                <>
                  <Toaster />
                  <Router />
                </>
              )}
            </TooltipProvider>
          </GameProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
