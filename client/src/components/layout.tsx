import { Header } from "./header";
import { XpBar } from "./xp-bar";
import { BottomNav } from "./bottom-nav";
import { LevelUpAnimation } from "./level-up-animation";
import { AchievementNotification } from "./achievement-notification";
import { useGame } from "@/lib/gameContext";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { showLevelUp, setShowLevelUp, showAchievement, setShowAchievement } = useGame();
  
  return (
    <div className="max-w-md mx-auto pb-16 relative min-h-screen bg-theme text-theme">
      {/* Red accent glow effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
      
      <div className="relative z-10">
        <Header />
        <XpBar />
        
        <main className="px-2">
          {children}
        </main>
      </div>
      
      <AchievementNotification show={showAchievement} />
      <LevelUpAnimation show={showLevelUp} onClose={() => setShowLevelUp(false)} />
      <BottomNav />
    </div>
  );
}
