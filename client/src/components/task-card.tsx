import { useGame } from "@/lib/gameContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Task } from "@shared/schema";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { completeTask } = useGame();
  const [isCompleting, setIsCompleting] = useState(false);
  const [animation, setAnimation] = useState(false);

  const handleComplete = async () => {
    if (task.completed || isCompleting) return;
    
    setIsCompleting(true);
    try {
      // First show the checkmark
      setAnimation(true);
      
      // Wait a moment before calling API
      setTimeout(async () => {
        await completeTask(task.id);
        
        // Wait for the animation before removing from list
        setTimeout(() => {
          setAnimation(false);
          setIsCompleting(false);
        }, 500);
      }, 500);
    } catch (error) {
      console.error("Failed to complete task:", error);
      setAnimation(false);
      setIsCompleting(false);
    }
  };

  return (
    <div 
      className={cn(
        "game-card bg-card p-4 flex items-center justify-between transition-all",
        animation && "task-complete"
      )}
    >
      <div className="flex items-center space-x-3">
        <button 
          className={cn(
            "w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center transition-colors",
            (task.completed || animation) ? "bg-primary" : "hover:bg-primary/20"
          )}
          onClick={handleComplete}
          disabled={task.completed || isCompleting}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={cn(
              "h-4 w-4 text-white", 
              !(task.completed || animation) && "opacity-0"
            )} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
        <span className="font-medium">{task.title}</span>
      </div>
      <div className="flex items-center bg-primary/20 dark:bg-primary-dark/30 rounded-full px-3 py-1">
        <span className="text-xs font-['Orbitron'] text-primary-dark dark:text-primary-light">
          +{task.xp} XP
        </span>
      </div>
    </div>
  );
}
