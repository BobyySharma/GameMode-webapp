import { useGame } from "@/lib/gameContext";
import { TaskCard } from "./task-card";
import { useEffect } from "react";
import { getTodayDateString, formatDate } from "@/lib/utils";

export function TaskList() {
  const { tasks, refreshTasks, isLoading } = useGame();
  
  useEffect(() => {
    const today = getTodayDateString();
    refreshTasks(today);
  }, [refreshTasks]);

  const today = getTodayDateString();
  const formattedDate = formatDate(today);
  
  // Filter for incomplete tasks first, then by completion status
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return 0;
  });

  return (
    <div className="px-4 pb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-['Poppins'] font-semibold">Today's Quests</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</div>
      </div>

      {isLoading ? (
        <div className="space-y-3 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-card animate-pulse rounded-xl" />
          ))}
        </div>
      ) : sortedTasks.length > 0 ? (
        <div className="space-y-3 mb-6">
          {sortedTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 mb-6">
          <p className="text-muted-foreground">No quests for today. Add a new quest to begin your journey!</p>
        </div>
      )}
    </div>
  );
}
