import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface AchievementNotificationProps {
  show: boolean;
  title?: string;
  description?: string;
  xpAwarded?: number;
}

export function AchievementNotification({ 
  show, 
  title = "Achievement Unlocked!", 
  description = "Completed your quest",
  xpAwarded = 20
}: AchievementNotificationProps) {
  const [animationState, setAnimationState] = useState<'entering' | 'visible' | 'exiting' | 'hidden'>('hidden');
  
  useEffect(() => {
    if (show) {
      // Start enter animation
      setAnimationState('entering');
      
      // After enter animation, set to visible
      const visibleTimer = setTimeout(() => {
        setAnimationState('visible');
      }, 300);
      
      // Start exit animation after a delay
      const exitTimer = setTimeout(() => {
        setAnimationState('exiting');
      }, 2700);
      
      return () => {
        clearTimeout(visibleTimer);
        clearTimeout(exitTimer);
      };
    } else {
      setAnimationState('hidden');
    }
  }, [show]);
  
  if (animationState === 'hidden') return null;
  
  return (
    <div className="fixed bottom-20 left-0 right-0 flex justify-center z-40 pointer-events-none">
      <div 
        className={`
          bg-gradient-to-r from-primary to-indigo-600 text-white p-4 rounded-lg shadow-lg 
          flex items-center gap-3 max-w-xs transform transition-all duration-300
          ${animationState === 'entering' ? 'translate-y-16 opacity-0' : ''}
          ${animationState === 'visible' ? 'translate-y-0 opacity-100' : ''}
          ${animationState === 'exiting' ? 'translate-y-0 opacity-0' : ''}
        `}
      >
        {/* Achievement icon with pulse effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-30"></div>
          <div className="relative bg-white rounded-full p-2 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {/* Achievement text */}
        <div className="flex-1">
          <p className="text-sm font-medium font-['Orbitron']">{title}</p>
          <p className="text-xs text-white/90">{description}</p>
        </div>
        
        {/* XP bonus indicator */}
        <div className="bg-white/20 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
          <span className="text-yellow-300">+{xpAwarded}</span>
          <span className="uppercase text-[10px]">XP</span>
        </div>
      </div>
    </div>
  );
}
