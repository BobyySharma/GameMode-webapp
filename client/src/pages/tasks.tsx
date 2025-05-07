import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { TaskCard } from "@/components/task-card";
import { AddTaskModal } from "@/components/add-task-modal";
import { Button } from "@/components/ui/button";
import { useGame } from "@/lib/gameContext";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Plus } from "lucide-react";

export default function Tasks() {
  const { tasks, refreshTasks, isLoading } = useGame();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  
  useEffect(() => {
    const dateString = selectedDate.toISOString().split('T')[0];
    refreshTasks(dateString);
  }, [selectedDate, refreshTasks]);
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };
  
  const dateString = selectedDate.toISOString().split('T')[0];
  const formattedDate = formatDate(dateString);
  
  // Filter for incomplete tasks first, then by completion status
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return 0;
  });
  
  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-['Poppins'] font-bold mb-4">Tasks Calendar</h1>
        
        <Card className="mb-6">
          <CardContent className="p-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-['Poppins'] font-semibold">Quests for {formattedDate}</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsAddTaskModalOpen(true)}
            className="rounded-full"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-card animate-pulse rounded-xl" />
            ))}
          </div>
        ) : sortedTasks.length > 0 ? (
          <div className="space-y-3">
            {sortedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No quests for this day. Add a new quest to begin your journey!</p>
            <Button
              className="mt-4"
              onClick={() => setIsAddTaskModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Quest
            </Button>
          </div>
        )}
      </div>
      
      <AddTaskModal 
        isOpen={isAddTaskModalOpen} 
        onClose={() => setIsAddTaskModalOpen(false)} 
      />
    </Layout>
  );
}
