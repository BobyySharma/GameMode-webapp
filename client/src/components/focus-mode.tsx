import { useState, useEffect, useRef } from "react";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatTimer } from "@/lib/utils";

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: {
    title: string;
    xp: number;
  };
}

export function FocusMode({ isOpen, onClose, initialTask }: FocusModeProps) {
  const { awardXpFromFocus } = useGame();
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const task = initialTask || {
    title: "Focus Session",
    xp: 50,
  };
  
  useEffect(() => {
    // Reset timer when dialog opens
    if (isOpen) {
      resetTimer();
      setTimerFinished(false);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isOpen]);
  
  const startTimer = () => {
    if (timerFinished) return;
    
    if (!timerRunning) {
      setTimerRunning(true);
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Timer complete
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            setTimerRunning(false);
            setTimerFinished(true);
            
            // Award XP for completing the focus session
            awardXpFromFocus(task.xp);
            
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      // Pause timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimerRunning(false);
    }
  };
  
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeLeft(25 * 60);
    setTimerRunning(false);
    setTimerFinished(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-['Poppins'] font-semibold">Focus Mode</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          {/* Current Task */}
          <div className="game-card bg-card p-5 mb-6 w-full text-center">
            <h3 className="text-lg font-medium mb-2">{task.title}</h3>
            <div className="inline-flex items-center bg-primary/20 dark:bg-primary-dark/30 rounded-full px-3 py-1">
              <span className="text-sm font-['Orbitron'] text-primary-dark dark:text-primary-light">
                +{task.xp} XP
              </span>
            </div>
          </div>
          
          {/* Timer */}
          <div className="relative mb-8">
            <div className="w-60 h-60 rounded-full border-8 border-gray-200 dark:border-gray-700 flex items-center justify-center">
              <div className="w-full h-full absolute">
                <svg className={timerRunning ? "timer-rotate" : ""} viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="36,36" className="text-primary-light opacity-20" />
                </svg>
              </div>
              <div className="text-center">
                <span className="block text-5xl font-['Orbitron'] mb-1">
                  {formatTimer(timeLeft)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {timerFinished ? 'completed!' : 'minutes remaining'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex space-x-4">
            <Button
              onClick={startTimer}
              disabled={timerFinished}
              variant="default"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary-dark"
            >
              {timerRunning ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Start
                </>
              )}
            </Button>
            <Button
              onClick={resetTimer}
              variant="outline"
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-full font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
