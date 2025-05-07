import { Button } from "@/components/ui/button";
import { useGame } from "@/lib/gameContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface LevelUpAnimationProps {
  show: boolean;
  onClose: () => void;
}

export function LevelUpAnimation({ show, onClose }: LevelUpAnimationProps) {
  const { user } = useGame();

  if (!user) return null;

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="bg-transparent border-none shadow-none max-w-md">
        <div className="text-center level-up">
          <div className="mb-4">
            {/* A level up icon with sparkling effect */}
            <div className="inline-block relative">
              <div className="absolute -inset-1">
                {/* SVG Sparkles animation */}
                <svg className="animate-spin h-32 w-32 absolute opacity-20" fill="none" viewBox="0 0 24 24">
                  <path stroke="white" strokeWidth="1" d="M12 2v20M2 12h20M4 4l16 16M4 20L20 4" />
                </svg>
              </div>
              <div className="relative bg-primary text-primary-foreground rounded-full h-24 w-24 flex items-center justify-center">
                <span className="font-['Orbitron'] text-4xl font-bold">{user.level}</span>
              </div>
            </div>
          </div>
          <h2 className="text-white text-2xl font-['Poppins'] font-bold mb-2">Level Up!</h2>
          <p className="text-gray-300">You've reached <span className="text-white font-medium">Level {user.level}</span>!</p>
          <p className="text-gray-300 mb-6">
            {user.level === 2 && "Unlock: Focus Mode Duration Options"}
            {user.level === 3 && "Unlock: Daily Challenge feature"}
            {user.level === 4 && "Unlock: Task Categories"}
            {user.level === 5 && "Unlock: Custom Badges"}
            {user.level > 5 && "Unlock: Special Powers"}
          </p>
          <Button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary-dark"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
