import { useGame } from "@/lib/gameContext";
import { useEffect, useState, useRef } from "react";

export function XpBar() {
  const { user, xpForNextLevel, xpPercentage } = useGame();
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const prevXpRef = useRef(0);

  useEffect(() => {
    if (!user) return;
    
    // If XP increased, trigger the pulse animation
    if (prevXpRef.current < user.xp) {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 1500);
    }
    
    // Smoothly animate the progress bar
    let start = animatedPercentage;
    const end = xpPercentage;
    const duration = 1000;
    const startTime = Date.now();
    
    const animateValue = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easeOutQuad easing function for smooth finish
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = start + (end - start) * eased;
      
      setAnimatedPercentage(current);
      
      if (progress < 1) {
        requestAnimationFrame(animateValue);
      }
    };
    
    requestAnimationFrame(animateValue);
    prevXpRef.current = user.xp;
  }, [user?.xp, xpPercentage]);

  if (!user) return null;

  return (
    <div className="px-4 mb-6 relative">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">XP</span>
        <span className={`text-sm font-['Orbitron'] transition-all duration-300 ${isPulsing ? 'scale-110 text-primary' : ''}`}>
          <span>{user.xp % xpForNextLevel}</span>/<span>{xpForNextLevel}</span>
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-card rounded-full h-4 overflow-hidden">
        <div 
          className={`progress-fill bg-gradient-to-r from-secondary to-primary h-4 rounded-full transition-all ${isPulsing ? 'animate-pulse' : ''}`}
          style={{ width: `${animatedPercentage}%` }}
        >
          {/* Sparkle effect when close to level up */}
          {animatedPercentage > 85 && (
            <div className="absolute right-0 top-0 h-full w-4 animate-sparkle">
              <div className="h-1 w-1 bg-white rounded-full absolute top-1/2 right-1/2 opacity-75"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Level icon */}
      <div className={`absolute -top-1 -right-2 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center text-xs font-bold shadow-lg transition-all duration-300 ${isPulsing ? 'scale-110 animate-pulse' : ''}`}>
        {user.level}
      </div>
    </div>
  );
}

export default XpBar;
