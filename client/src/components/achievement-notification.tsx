import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

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
  const timerRef = useRef<{visibleTimer?: NodeJS.Timeout, exitTimer?: NodeJS.Timeout}>({});
  
  useEffect(() => {
    if (show) {
      // Start enter animation
      setAnimationState('entering');
      
      // After enter animation, set to visible
      timerRef.current.visibleTimer = setTimeout(() => {
        setAnimationState('visible');
      }, 300);
      
      // Start exit animation after a delay
      timerRef.current.exitTimer = setTimeout(() => {
        setAnimationState('exiting');
      }, 2700);
      
      return () => {
        if (timerRef.current.visibleTimer) clearTimeout(timerRef.current.visibleTimer);
        if (timerRef.current.exitTimer) clearTimeout(timerRef.current.exitTimer);
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
          bg-gradient-to-r from-red-900 to-red-700 text-white p-4 rounded-lg shadow-lg 
          flex items-center gap-3 max-w-xs transform transition-all duration-300
          ${animationState === 'entering' ? 'translate-y-16 opacity-0' : ''}
          ${animationState === 'visible' ? 'translate-y-0 opacity-100' : ''}
          ${animationState === 'exiting' ? 'translate-y-0 opacity-0' : ''}
          border border-red-500/30
        `}
      >
        {/* Achievement icon with pulse effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30"></div>
          <div className="relative bg-black rounded-full p-2 shadow-inner border border-red-500/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {/* Achievement text */}
        <div className="flex-1">
          <p className="text-sm font-bold font-['Orbitron'] text-white">{title}</p>
          <p className="text-xs text-white/80">{description}</p>
        </div>
        
        {/* XP bonus indicator with red AMOLED theme */}
        <div className="bg-black px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 border border-red-500/40 shadow-glow">
          <span className="text-red-400 font-['Orbitron']">+{xpAwarded}</span>
          <span className="uppercase text-[10px] text-white">XP</span>
        </div>
      </div>
    </div>
  );
}
