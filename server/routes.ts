import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send the password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  app.patch("/api/users/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
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
  
  // Login (simplified for demo)
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      // Create a login schema using zod
      const loginSchema = z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
      });
      
      // Validate the request body
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
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
        
        await storage.updateUser(user.id, { 
          streak: newStreak,
          lastActive: today,
        });
      }
      
      // Don't send the password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Task routes
  app.get("/api/users/:userId/tasks", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
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
  
  app.post("/api/users/:userId/tasks", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
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
  
  app.patch("/api/tasks/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    
    try {
      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
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
  
  app.delete("/api/tasks/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
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
