import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
  // Middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Not authenticated" });
  };

  // Current user
  app.get("/api/user", isAuthenticated, (req: Request, res: Response) => {
    // Password is already removed in passport serialization
    res.json(req.user);
  });
  
  // User routes
  app.get("/api/users/:id", isAuthenticated, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    // Only allow users to get their own data
    if (req.user?.id !== id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send the password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  app.patch("/api/users/:id", isAuthenticated, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    // Only allow users to update their own data
    if (req.user?.id !== id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    try {
      const updatedUser = await storage.updateUser(id, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  
  // Login streak update
  app.post("/api/update-streak", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update user streak
      const today = new Date();
      const lastActiveDate = new Date(user.lastActive);
      
      // Check if it's a new day since last login
      const isNewDay = 
        today.getDate() !== lastActiveDate.getDate() ||
        today.getMonth() !== lastActiveDate.getMonth() ||
        today.getFullYear() !== lastActiveDate.getFullYear();
        
      if (isNewDay) {
        const dayDifference = Math.floor(
          (today.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        // If it's the next day, increase streak; if it's been more than a day, reset
        let newStreak = user.streak;
        if (dayDifference === 1) {
          newStreak += 1;
        } else if (dayDifference > 1) {
          newStreak = 1; // Reset streak but count today
        }
        
        const updatedUser = await storage.updateUser(user.id, { 
          streak: newStreak,
          lastActive: today,
        });
        
        if (updatedUser) {
          const { password, ...userWithoutPassword } = updatedUser;
          return res.json(userWithoutPassword);
        }
      }
      
      // If no streak update was needed
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Streak update error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Task routes
  app.get("/api/users/:userId/tasks", isAuthenticated, async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    // Only allow users to see their own tasks
    if (req.user?.id !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    const date = req.query.date as string;
    let tasks;
    
    if (date) {
      tasks = await storage.getTasksByDate(userId, date);
    } else {
      tasks = await storage.getTasks(userId);
    }
    
    res.json(tasks);
  });
  
  app.post("/api/users/:userId/tasks", isAuthenticated, async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    // Only allow users to create tasks for themselves
    if (req.user?.id !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    try {
      const taskData = { ...req.body, userId };
      const validatedData = insertTaskSchema.parse(taskData);
      
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create task" });
    }
  });
  
  app.patch("/api/tasks/:id", isAuthenticated, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    
    try {
      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // Only allow users to update their own tasks
      if (req.user?.id !== task.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // If marking the task as completed, award XP to the user
      if (req.body.completed === true && !task.completed) {
        const user = await storage.getUser(task.userId);
        if (user) {
          const newXp = user.xp + task.xp;
          
          // Check for level up (level * 100 XP needed)
          let newLevel = user.level;
          const xpForNextLevel = user.level * 100;
          
          if (newXp >= xpForNextLevel) {
            newLevel += 1;
          }
          
          await storage.updateUser(user.id, {
            xp: newXp,
            level: newLevel,
          });
        }
      }
      
      const updatedTask = await storage.updateTask(id, req.body);
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: "Failed to update task" });
    }
  });
  
  app.delete("/api/tasks/:id", isAuthenticated, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    
    // Check if task belongs to user
    const task = await storage.getTask(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    // Only allow users to delete their own tasks
    if (req.user?.id !== task.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    const deleted = await storage.deleteTask(id);
    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    res.status(204).end();
  });

  const httpServer = createServer(app);
  return httpServer;
}
