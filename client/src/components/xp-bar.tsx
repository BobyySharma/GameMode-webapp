import { useGame } from "@/lib/gameContext";
import { useEffect, useState, useRef } from "react";

export function XpBar() {
  const { user, xpForNextLevel, xpPercentage } = useGame();
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const prevXpRef = useRef(0);
  const animationRef = useRef<number | null>(null);

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
    
    // Clean up previous animation frame if it exists
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    const animateValue = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easeOutQuad easing function for smooth finish
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = start + (end - start) * eased;
      
      setAnimatedPercentage(current);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateValue);
      } else {
        animationRef.current = null;
      }
    };
    
    animationRef.current = requestAnimationFrame(animateValue);
    prevXpRef.current = user.xp;
    
    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [user?.xp, xpPercentage]);

  if (!user) return null;

  return (
    <div className="px-4 mb-6 relative">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-200">XP</span>
        <span className={`text-sm font-['Orbitron'] transition-all duration-300 ${isPulsing ? 'scale-110 text-primary' : 'text-white'}`}>
          <span>{user.xp % xpForNextLevel}</span>/<span>{xpForNextLevel}</span>
        </span>
      </div>
      <div className="w-full bg-gray-900 border border-gray-800 rounded-full h-5 overflow-hidden shadow-inner">
        <div 
          className={`progress-fill bg-gradient-to-r from-red-800 to-red-500 h-full rounded-full transition-all duration-300 ${isPulsing ? 'animate-pulse' : ''}`}
          style={{ width: `${animatedPercentage}%` }}
        >
          {/* Sparkle effect when close to level up */}
          {animatedPercentage > 85 && (
            <div className="absolute right-0 top-0 h-full w-6 animate-sparkle">
              <div className="h-1.5 w-1.5 bg-white rounded-full absolute top-1/2 right-1/2 opacity-90 shadow-glow"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Level icon */}
      <div 
        className={`absolute -top-1 -right-2 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full h-9 w-9 flex items-center justify-center text-xs font-bold shadow-lg transition-all duration-300 ${
          isPulsing ? 'scale-110 animate-pulse shadow-red-500/50' : ''
        } border border-red-500/30`}
      >
        {user.level}
      </div>
      
      {/* Level indicator */}
      <div className="absolute -bottom-5 right-0 text-xs text-gray-400">
        Level {user.level}
      </div>
    </div>
  );
}

export default XpBar;
