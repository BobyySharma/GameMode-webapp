import { useGame } from "@/lib/gameContext";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function XpBar() {
  const { user, xpForNextLevel, xpPercentage } = useGame();
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const prevXpRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const levelUpThreshold = 85; // Percentage when to show level-up sparkles

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
    const duration = 1200; // Slightly longer for more satisfying animation
    const startTime = Date.now();
    
    // Clean up previous animation frame if it exists
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    const animateValue = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easeOutExpo easing function for snappier finish
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * eased;
      
      setAnimatedPercentage(current);
      
      // Show sparkles when approaching level up
      setShowSparkles(current > levelUpThreshold);
      
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
    <div className="px-4 mb-8 relative">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-400 dark:text-gray-300">XP</span>
        <motion.span 
          className="text-sm font-['Orbitron'] text-red-500"
          animate={{ 
            scale: isPulsing ? [1, 1.15, 1] : 1,
            color: isPulsing ? ['#ef4444', '#fca5a5', '#ef4444'] : '#ef4444'
          }}
          transition={{ duration: 1.5, times: [0, 0.5, 1] }}
        >
          <span>{user.xp % xpForNextLevel}</span>/<span>{xpForNextLevel}</span>
        </motion.span>
      </div>
      
      {/* Progress bar container */}
      <div className="w-full h-5 bg-black/30 dark:bg-white/5 rounded-full overflow-hidden border border-red-900/20 shadow-inner relative">
        {/* Animated XP fill */}
        <motion.div 
          className="h-full rounded-full bg-gradient-to-r from-red-800 to-red-500 relative overflow-hidden will-change-transform"
          style={{ width: `${animatedPercentage}%` }}
          animate={{ 
            boxShadow: isPulsing ? 
              ['0 0 0px rgba(239, 68, 68, 0.5)', '0 0 10px rgba(239, 68, 68, 0.8)', '0 0 0px rgba(239, 68, 68, 0.5)'] : 
              '0 0 5px rgba(239, 68, 68, 0.5)'
          }}
          transition={{ duration: 1.5, times: [0, 0.5, 1], ease: 'easeInOut' }}
        >
          {/* Light streak effect */}
          <div 
            className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent ${isPulsing ? 'animate-shimmer' : ''}`}
            style={{ 
              width: '200%', 
              transform: 'translateX(-100%)',
            }}
          />
          
          {/* Sparkle effects when close to level up */}
          <AnimatePresence>
            {showSparkles && (
              <>
                <motion.div
                  key="sparkle1"
                  className="absolute right-3 top-[20%] h-1 w-1 rounded-full bg-white"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1.2, 0],
                    y: [-2, 0, 2]
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    repeatType: 'loop'
                  }}
                />
                <motion.div
                  key="sparkle2"
                  className="absolute right-7 top-[60%] h-1.5 w-1.5 rounded-full bg-white"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1.5, 0],
                    y: [1, 0, -1]
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: 'loop',
                    delay: 0.5
                  }}
                />
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      {/* Level badge */}
      <motion.div 
        className="absolute -top-2 -right-1 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-full h-9 w-9 flex items-center justify-center text-xs font-bold shadow-lg border border-red-500/30 select-none z-10"
        animate={{ 
          scale: isPulsing ? [1, 1.2, 1] : 1,
          boxShadow: isPulsing ? 
            ['0 0 0px rgba(239, 68, 68, 0)', '0 0 15px rgba(239, 68, 68, 0.6)', '0 0 5px rgba(239, 68, 68, 0.3)'] : 
            '0 0 5px rgba(239, 68, 68, 0.3)'
        }}
        transition={{ duration: 1, times: [0, 0.5, 1] }}
      >
        <span className="font-['Orbitron']">{user.level}</span>
      </motion.div>
      
      {/* Level up indicator text */}
      <div className="absolute -bottom-6 right-1 text-xs text-gray-400 uppercase tracking-wider font-medium">
        {showSparkles ? (
          <motion.span 
            className="text-red-500"
            animate={{ 
              opacity: [0.7, 1, 0.7],
              scale: [0.95, 1.05, 0.95]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Almost Level {user.level + 1}!
          </motion.span>
        ) : (
          <span>Level {user.level}</span>
        )}
      </div>
    </div>
  );
}

export default XpBar;
