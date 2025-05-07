import { useState } from "react";
import { Layout } from "@/components/layout";
import { TaskList } from "@/components/task-list";
import { AddTaskModal } from "@/components/add-task-modal";
import { FocusMode } from "@/components/focus-mode";
import { Button } from "@/components/ui/button";
import { Plus, Clock } from "lucide-react";

export default function Home() {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  
  return (
    <Layout>
      <TaskList />
      
      {/* "Add Task" and "Start Focus Mode" Buttons */}
      <div className="flex space-x-3 px-4">
        <Button
          onClick={() => setIsAddTaskModalOpen(true)}
          variant="outline"
          className="flex-1 bg-card flex items-center justify-center py-6 font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Quest
        </Button>
        
        <Button
          onClick={() => setIsFocusModeOpen(true)}
          className="flex-1 bg-primary text-primary-foreground flex items-center justify-center py-6 font-medium hover:bg-primary-dark transition-colors"
        >
          <Clock className="h-5 w-5 mr-2" />
          Focus Mode
        </Button>
      </div>
      
      <AddTaskModal 
        isOpen={isAddTaskModalOpen} 
        onClose={() => setIsAddTaskModalOpen(false)} 
      />
      
      <FocusMode 
        isOpen={isFocusModeOpen} 
        onClose={() => setIsFocusModeOpen(false)} 
      />
    </Layout>
  );
}
