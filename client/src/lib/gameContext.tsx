import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Task } from "@shared/schema";
import { apiRequest } from "./queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface GameContextType {
  user: User | null;
  tasks: Task[];
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshTasks: (date?: string) => Promise<void>;
  completeTask: (taskId: number) => Promise<void>;
  addTask: (title: string, xp: number, dueDate: string) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  xpForNextLevel: number;
  xpPercentage: number;
  showLevelUp: boolean;
  setShowLevelUp: (show: boolean) => void;
  showAchievement: boolean;
  setShowAchievement: (show: boolean) => void;
  awardXpFromFocus: (xp: number) => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const { toast } = useToast();

  // Calculate XP needed for next level
  const xpForNextLevel = user ? user.level * 100 : 100;

  // Calculate XP percentage for progress bar
  const xpPercentage = user ? Math.min(100, Math.floor((user.xp % xpForNextLevel) / xpForNextLevel * 100)) : 0;

  // Use the authenticated user from useAuth
  const { user: authUser } = useAuth();

  // Update user state when auth user changes
  useEffect(() => {
    if (authUser) {
      // Set game user from auth user
      setUser(authUser as User);
      // Then fetch tasks for the user
      refreshTasks();
    } else {
      // Clear user and tasks when logged out
      setUser(null);
      setTasks([]);
    }
  }, [authUser]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/login', { username, password });
      const userData = await response.json();
      setUser(userData);
      setTimeout(() => {
        refreshTasks();
      }, 0);
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setTasks([]);
  };

  const refreshTasks = async (date?: string) => {
    if (!user) return;

    // Prevent concurrent refreshes
    if (isLoading) return;

    setIsLoading(true);
    const controller = new AbortController();
    
    try {
      const endpoint = date 
        ? `/api/users/${user.id}/tasks?date=${date}`
        : `/api/users/${user.id}/tasks`;

      const response = await apiRequest('GET', endpoint);
      const tasksData = await response.json();
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error loading tasks",
        description: "Failed to load your tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (title: string, xp: number, dueDate: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', `/api/users/${user.id}/tasks`, {
        title,
        xp,
        dueDate,
      });

      const newTask = await response.json();
      setTasks((prev) => [...prev, newTask]);

      toast({
        title: "Task added",
        description: `New quest "${title}" added!`,
      });
    } catch (error) {
      toast({
        title: "Error adding task",
        description: "Failed to add your task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const completeTask = async (taskId: number) => {
    if (!user) return;

    try {
      const taskToComplete = tasks.find(t => t.id === taskId);
      if (!taskToComplete || taskToComplete.completed) return;

      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, completed: true } : task
        )
      );

      const response = await apiRequest('PATCH', `/api/tasks/${taskId}`, {
        completed: true,
      });

      const updatedTask = await response.json();

      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 3000);

      const userResponse = await apiRequest('GET', `/api/users/${user.id}`);
      const updatedUser = await userResponse.json();

      if (updatedUser.level > user.level) {
        setShowLevelUp(true);
      }

      setUser(updatedUser);
    } catch (error) {
      toast({
        title: "Error completing task",
        description: "Failed to mark task as completed. Please try again.",
        variant: "destructive",
      });

      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, completed: false } : task
        )
      );
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!user) return;

    try {
      setTasks(prev => prev.filter(task => task.id !== taskId));

      await apiRequest('DELETE', `/api/tasks/${taskId}`);

      toast({
        title: "Task deleted",
        description: "Quest removed successfully.",
      });
    } catch (error) {
      refreshTasks();

      toast({
        title: "Error deleting task",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const awardXpFromFocus = async (xp: number) => {
    if (!user) return;

    try {
      const newXp = user.xp + xp;
      const newLevel = Math.floor(newXp / 100) + 1;
      const levelUp = newLevel > user.level;

      const response = await apiRequest('PATCH', `/api/users/${user.id}`, {
        xp: newXp,
        level: newLevel,
      });

      const updatedUser = await response.json();
      setUser(updatedUser);

      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 3000);

      if (levelUp) {
        setShowLevelUp(true);
      }
    } catch (error) {
      toast({
        title: "Error awarding XP",
        description: "Failed to award XP for focus session.",
        variant: "destructive",
      });
    }
  };

  return (
    <GameContext.Provider
      value={{
        user,
        tasks,
        isLoading,
        isLoggedIn: !!user,
        login,
        logout,
        refreshTasks,
        completeTask,
        addTask,
        deleteTask,
        xpForNextLevel,
        xpPercentage,
        showLevelUp,
        setShowLevelUp,
        showAchievement,
        setShowAchievement,
        awardXpFromFocus,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}