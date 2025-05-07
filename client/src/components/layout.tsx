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
    <div className="max-w-md mx-auto pb-16 relative min-h-screen bg-background text-foreground">
      <Header />
      <XpBar />
      
      <main>
        {children}
      </main>
      
      <AchievementNotification show={showAchievement} />
      <LevelUpAnimation show={showLevelUp} onClose={() => setShowLevelUp(false)} />
      <BottomNav />
    </div>
  );
}
