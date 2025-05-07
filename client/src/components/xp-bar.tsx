import { useGame } from "@/lib/gameContext";

export function XpBar() {
  const { user, xpForNextLevel, xpPercentage } = useGame();

  if (!user) return null;
  
  return (
    <div className="px-4 mb-6">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">XP</span>
        <span className="text-sm font-['Orbitron']">
          <span>{user.xp % xpForNextLevel}</span>/<span>{xpForNextLevel}</span>
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-card rounded-full h-4">
        <div 
          className="progress-fill bg-gradient-to-r from-secondary to-primary h-4 rounded-full"
          style={{ width: `${xpPercentage}%` }}
        />
      </div>
    </div>
  );
}

export default XpBar;
