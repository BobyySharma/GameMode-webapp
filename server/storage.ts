import { users, tasks, type User, type InsertUser, type Task, type InsertTask } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  
  getTasks(userId: number): Promise<Task[]>;
  getTasksByDate(userId: number, date: string): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, data: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values({
      ...insertUser,
      xp: 0,
      level: 1,
      streak: 0,
      lastActive: new Date(),
    }).returning();
    
    return result[0];
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    
    return result[0];
  }

  async getTasks(userId: number): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.userId, userId));
  }

  async getTasksByDate(userId: number, date: string): Promise<Task[]> {
    return db.select()
      .from(tasks)
      .where(and(
        eq(tasks.userId, userId),
        eq(tasks.dueDate, date)
      ));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const result = await db.select().from(tasks).where(eq(tasks.id, id));
    return result[0];
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const result = await db.insert(tasks)
      .values({
        ...insertTask,
        completed: false,
      })
      .returning();
    
    return result[0];
  }

  async updateTask(id: number, data: Partial<Task>): Promise<Task | undefined> {
    const result = await db.update(tasks)
      .set(data)
      .where(eq(tasks.id, id))
      .returning();
    
    return result[0];
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks)
      .where(eq(tasks.id, id))
      .returning({ id: tasks.id });
    
    return result.length > 0;
  }

  // Initialize with seed data if needed
  async seed() {
    const existingUsers = await db.select().from(users);
    
    if (existingUsers.length === 0) {
      // Create default user
      const user = await this.createUser({
        username: "Ash",
        password: "password123",
      });
      
      // Add default tasks
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      await this.createTask({
        userId: user.id,
        title: "Read docs",
        xp: 20,
        dueDate: today,
      });
      
      await this.createTask({
        userId: user.id,
        title: "Setup Firebase",
        xp: 30,
        dueDate: today,
      });
      
      await this.createTask({
        userId: user.id,
        title: "Build home screen",
        xp: 50,
        dueDate: today,
      });
      
      // Update the user with some initial XP
      await this.updateUser(user.id, {
        xp: 120,
        level: 2,
        streak: 3,
      });
    }
  }
}

export const storage = new DatabaseStorage();

// Initialize the database with seed data
storage.seed().catch(err => {
  console.error("Failed to seed database:", err);
});
