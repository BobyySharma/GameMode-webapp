import { useGame } from "@/lib/gameContext";
import { useAuth } from "@/hooks/use-auth";
import { getRankTitle } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function Header() {
  const { user } = useGame();
  const { user: authUser, logoutMutation } = useAuth();

  if (!user) return null;

  return (
    <header className="flex justify-between items-center p-4 sticky top-0 bg-theme z-10">
      <div className="flex items-center space-x-2">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800 text-white font-['Orbitron'] font-bold border border-red-500/30 shadow-glow">
          <span className="text-lg">{user.level}</span>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">LEVEL</p>
          <h1 className="font-['Orbitron'] font-bold text-theme">{getRankTitle(user.level)}</h1>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {/* Streak counter */}
        <div className="flex items-center space-x-1 bg-black/10 dark:bg-white/5 p-1.5 pl-2 pr-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
          <span className="font-['Orbitron'] font-medium text-red-500">{user.streak}</span>
        </div>
        
        {/* Theme toggle */}
        <ThemeToggle />
        
        {/* Logout button */}
        {authUser && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => logoutMutation.mutate()}
            className="rounded-full"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}
