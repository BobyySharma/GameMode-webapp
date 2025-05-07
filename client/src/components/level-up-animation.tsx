import { Button } from "@/components/ui/button";
import { useGame } from "@/lib/gameContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { getRankTitle } from "@/lib/utils";

interface LevelUpAnimationProps {
  show: boolean;
  onClose: () => void;
}

export function LevelUpAnimation({ show, onClose }: LevelUpAnimationProps) {
  const { user } = useGame();
  const [animationStage, setAnimationStage] = useState(0);
  
  useEffect(() => {
    if (show) {
      // Reset animation stage when dialog opens
      setAnimationStage(0);
      
      // Sequence animation stages
      const timer1 = setTimeout(() => setAnimationStage(1), 500);
      const timer2 = setTimeout(() => setAnimationStage(2), 1500);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [show]);

  if (!user) return null;
  
  const rankTitle = getRankTitle(user.level);

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-black/90 to-gray-800/90 border-primary shadow-xl max-w-md rounded-xl" aria-describedby="level-up-description">
        <div id="level-up-description" className="text-center level-up p-4">
          <div className="mb-6 relative">
            {/* Stars bursting animation */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-yellow-300"
                  style={{
                    top: `${50 + Math.sin(i * Math.PI/4) * 70}%`,
                    left: `${50 + Math.cos(i * Math.PI/4) * 70}%`,
                    opacity: animationStage > 0 ? 0.8 : 0,
                    transform: `scale(${animationStage > 0 ? 1.5 : 0})`,
                    transition: 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
                    boxShadow: '0 0 10px 2px rgba(255, 215, 0, 0.7)'
                  }}
                />
              ))}
            </div>
            
            {/* Level circle with animated border */}
            <div className="inline-block relative">
              <div className="absolute -inset-2">
                <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-primary to-purple-500 opacity-${animationStage > 0 ? '100' : '0'} transition-opacity duration-500`} style={{ 
                  animation: animationStage > 0 ? 'spin 4s linear infinite' : 'none' 
                }}></div>
              </div>
              <div className="relative bg-gradient-to-br from-primary to-primary-dark text-primary-foreground rounded-full h-28 w-28 flex items-center justify-center shadow-lg z-10 border-2 border-white/20">
                <span className="font-['Orbitron'] text-5xl font-bold">{user.level}</span>
              </div>
            </div>
          </div>
          
          <h2 className="text-white text-3xl font-['Orbitron'] font-bold mb-3">LEVEL UP!</h2>
          
          <div className={`transition-all duration-700 ${animationStage > 1 ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}>
            <p className="text-gray-200 mb-1">You've reached <span className="text-white font-medium">Level {user.level}</span>!</p>
            <p className="text-primary text-xl font-semibold mb-4">{rankTitle}</p>
            
            <div className="mb-6 p-3 bg-gray-900/60 rounded-lg border border-gray-700">
              <h3 className="text-yellow-300 text-sm uppercase font-bold mb-2">Unlocked:</h3>
              <p className="text-white">
                {user.level === 2 && "Focus Mode Duration Options"}
                {user.level === 3 && "Daily Challenge Feature"}
                {user.level === 4 && "Task Categories"}
                {user.level === 5 && "Custom Badges"}
                {user.level > 5 && "Special Powers"}
              </p>
            </div>
            
            <Button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-primary to-indigo-500 text-primary-foreground rounded-full font-medium hover:brightness-110 transition-all duration-300"
            >
              Continue
            </Button>
          </div>
          
          {/* XP gained indicator */}
          <div className={`absolute top-3 right-3 bg-primary/20 text-white text-sm px-3 py-1 rounded-full transition-all duration-500 ${animationStage > 0 ? 'opacity-100' : 'opacity-0'}`}>
            +{user.level * 100 - 100} XP
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
