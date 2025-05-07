import { users, tasks, type User, type InsertUser, type Task, type InsertTask } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  userCurrentId: number;
  taskCurrentId: number;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.userCurrentId = 1;
    this.taskCurrentId = 1;
    
    // Add a default user for testing
    this.createUser({
      username: "Ash",
      password: "password123",
    }).then(user => {
      // Add some default tasks
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      this.createTask({
        userId: user.id,
        title: "Read docs",
        xp: 20,
        dueDate: today,
      });
      this.createTask({
        userId: user.id,
        title: "Setup Firebase",
        xp: 30,
        dueDate: today,
      });
      this.createTask({
        userId: user.id,
        title: "Build home screen",
        xp: 50,
        dueDate: today,
      });
      
      // Update the user with some initial XP
      this.updateUser(user.id, {
        xp: 120,
        level: 2,
        streak: 3,
      });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      xp: 0, 
      level: 1, 
      streak: 0,
      lastActive: now,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getTasks(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.userId === userId,
    );
  }

  async getTasksByDate(userId: number, date: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.userId === userId && task.dueDate === date,
    );
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskCurrentId++;
    const now = new Date();
    const task: Task = {
      ...insertTask,
      id,
      completed: false,
      createdAt: now,
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, data: Partial<Task>): Promise<Task | undefined> {
    const task = await this.getTask(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...data };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }
}

export const storage = new MemStorage();
