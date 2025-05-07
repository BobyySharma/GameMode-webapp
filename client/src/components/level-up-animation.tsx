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
      <DialogContent 
        className="bg-amoled border-red-glow shadow-xl max-w-md rounded-xl overflow-hidden" 
        aria-describedby="level-up-description"
      >
        {/* Background glow effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-black pointer-events-none"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div id="level-up-description" className="text-center level-up p-4 relative z-10">
          <div className="mb-6 relative">
            {/* Stars bursting animation - now with red theme */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-red-500"
                  style={{
                    top: `${50 + Math.sin(i * Math.PI/4) * 70}%`,
                    left: `${50 + Math.cos(i * Math.PI/4) * 70}%`,
                    opacity: animationStage > 0 ? 0.8 : 0,
                    transform: `scale(${animationStage > 0 ? 1.5 : 0})`,
                    transition: 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
                    boxShadow: '0 0 10px 2px rgba(220, 38, 38, 0.7)'
                  }}
                />
              ))}
            </div>
            
            {/* Level circle with animated border */}
            <div className="inline-block relative">
              <div className="absolute -inset-2">
                <div 
                  className={`absolute inset-0 rounded-full bg-gradient-to-r from-red-700 via-red-500 to-red-800 opacity-${animationStage > 0 ? '100' : '0'} transition-opacity duration-500 shadow-glow`} 
                  style={{ 
                    animation: animationStage > 0 ? 'spin 4s linear infinite' : 'none',
                    opacity: animationStage > 0 ? 1 : 0
                  }}
                ></div>
              </div>
              <div className="relative bg-gradient-to-br from-red-600 to-red-900 text-white rounded-full h-28 w-28 flex items-center justify-center shadow-lg z-10 border-2 border-red-500/30">
                <span className="font-['Orbitron'] text-5xl font-bold">{user.level}</span>
              </div>
            </div>
          </div>
          
          <h2 className="text-red-500 text-3xl font-['Orbitron'] font-bold mb-3 tracking-wider">LEVEL UP!</h2>
          
          <div className={`transition-all duration-700 ${animationStage > 1 ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}>
            <p className="text-gray-200 mb-1">You've reached <span className="text-white font-medium">Level {user.level}</span>!</p>
            <p className="text-red-500 text-xl font-semibold mb-4">{rankTitle}</p>
            
            <div className="mb-6 p-3 bg-gray-900/80 rounded-lg border border-red-900/50">
              <h3 className="text-red-400 text-sm uppercase font-bold mb-2">Unlocked:</h3>
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
              className="px-6 py-2 bg-gradient-to-r from-red-800 to-red-600 text-white rounded-full font-medium hover:brightness-110 transition-all duration-300 shadow-lg border border-red-500/30"
            >
              Continue
            </Button>
          </div>
          
          {/* XP gained indicator */}
          <div className={`absolute top-3 right-3 bg-red-900/50 text-white text-sm px-3 py-1 rounded-full transition-all duration-500 ${animationStage > 0 ? 'opacity-100' : 'opacity-0'} border border-red-500/30`}>
            <span className="text-red-400 font-bold">+{user.level * 100 - 100}</span> XP
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
