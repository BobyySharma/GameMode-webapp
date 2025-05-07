import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { TaskList } from "@/components/task-list";
import { AddTaskModal } from "@/components/add-task-modal";
import { FocusMode } from "@/components/focus-mode";
import { Button } from "@/components/ui/button";
import { Plus, Clock, Trophy } from "lucide-react";
import { useGame } from "@/lib/gameContext";
import { motion } from "framer-motion";

export default function Home() {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const { user, tasks, refreshTasks } = useGame();
  
  // Refresh tasks on initial load
  useEffect(() => {
    if (user) {
      refreshTasks();
    }
  }, [user]);
  
  // Get current time of day for personalized greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  
  return (
    <Layout>
      {/* Personalized greeting */}
      <motion.div 
        className="px-6 py-4 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-1 font-['Orbitron']">
          {getGreeting()}, <span className="text-red-500">{user?.username || "Hero"}</span>!
        </h1>
        <p className="text-gray-400 dark:text-gray-400">
          {tasks.filter(t => !t.completed).length > 0 
            ? `You have ${tasks.filter(t => !t.completed).length} quests remaining today.` 
            : "No active quests. Ready to add some?"}
        </p>
      </motion.div>
      
      <TaskList />
      
      {/* "Add Task" and "Start Focus Mode" Buttons */}
      <motion.div 
        className="flex space-x-3 px-4 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button
          onClick={() => setIsAddTaskModalOpen(true)}
          variant="outline"
          className="flex-1 bg-card-theme border border-red-900/20 flex items-center justify-center py-6 font-medium text-red-500 hover:bg-red-500/10 transition-all"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Quest
        </Button>
        
        <Button
          onClick={() => setIsFocusModeOpen(true)}
          className="flex-1 bg-gradient-to-r from-red-700 to-red-600 text-white flex items-center justify-center py-6 font-medium hover:from-red-800 hover:to-red-700 transition-all shadow-glow"
        >
          <Clock className="h-5 w-5 mr-2" />
          Focus Mode
        </Button>
      </motion.div>
      
      {/* Daily tip */}
      <motion.div 
        className="mt-6 mx-4 p-4 rounded-lg bg-black/20 dark:bg-white/5 border border-red-900/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center mb-2">
          <Trophy className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="font-medium text-sm">DAILY TIP</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Complete tasks consistently to maintain your streak and earn bonus XP. Focus mode helps you concentrate on a single task for maximum productivity.
        </p>
      </motion.div>
      
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
