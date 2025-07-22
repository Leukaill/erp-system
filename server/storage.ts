import {
  users,
  projects,
  inventory,
  transactions,
  activities,
  tasks,
  farmSectors,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type Inventory,
  type InsertInventory,
  type Transaction,
  type InsertTransaction,
  type Activity,
  type InsertActivity,
  type Task,
  type InsertTask,
  type FarmSector,
  type InsertFarmSector,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, or, sql, count } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Dashboard metrics
  getDashboardMetrics(userId: string): Promise<{
    totalRevenue: number;
    activeProjects: number;
    inventoryItems: number;
    farmArea: number;
    lowStockItems: number;
  }>;

  // Projects
  getProjects(userId: string): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<InsertProject>): Promise<Project>;

  // Inventory
  getInventory(): Promise<Inventory[]>;
  getLowStockItems(): Promise<Inventory[]>;
  getInventoryItem(id: number): Promise<Inventory | undefined>;
  createInventoryItem(item: InsertInventory): Promise<Inventory>;
  updateInventoryItem(id: number, updates: Partial<InsertInventory>): Promise<Inventory>;

  // Transactions
  getTransactions(userId: string, limit?: number): Promise<Transaction[]>;
  getFinancialSummary(userId: string, months?: number): Promise<{
    totalRevenue: number;
    totalExpenses: number;
    profit: number;
    transactions: Transaction[];
  }>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Activities
  getRecentActivities(userId: string, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Tasks
  getTasks(userId: string, status?: string): Promise<Task[]>;
  getTodaysTasks(userId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<InsertTask>): Promise<Task>;

  // Farm sectors
  getFarmSectors(): Promise<FarmSector[]>;
  createFarmSector(sector: InsertFarmSector): Promise<FarmSector>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Dashboard metrics
  async getDashboardMetrics(userId: string): Promise<{
    totalRevenue: number;
    activeProjects: number;
    inventoryItems: number;
    farmArea: number;
    lowStockItems: number;
  }> {
    // Get revenue from transactions
    const [revenueResult] = await db
      .select({ 
        total: sql<number>`COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0)::numeric`
      })
      .from(transactions)
      .where(eq(transactions.type, "income"));

    // Get active projects count
    const [projectsResult] = await db
      .select({ count: count() })
      .from(projects)
      .where(and(
        eq(projects.managerId, userId),
        or(eq(projects.status, "active"), eq(projects.status, "planning"))
      ));

    // Get total inventory items
    const [inventoryResult] = await db
      .select({ count: count() })
      .from(inventory);

    // Get total farm area
    const [farmAreaResult] = await db
      .select({ 
        total: sql<number>`COALESCE(SUM(area), 0)::numeric`
      })
      .from(farmSectors);

    // Get low stock items count
    const [lowStockResult] = await db
      .select({ count: count() })
      .from(inventory)
      .where(sql`current_stock <= min_stock`);

    return {
      totalRevenue: Number(revenueResult?.total || 0),
      activeProjects: projectsResult?.count || 0,
      inventoryItems: inventoryResult?.count || 0,
      farmArea: Number(farmAreaResult?.total || 0),
      lowStockItems: lowStockResult?.count || 0,
    };
  }

  // Projects
  async getProjects(userId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.managerId, userId))
      .orderBy(desc(projects.updatedAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values(project)
      .returning();
    return newProject;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  // Inventory
  async getInventory(): Promise<Inventory[]> {
    return await db
      .select()
      .from(inventory)
      .orderBy(asc(inventory.name));
  }

  async getLowStockItems(): Promise<Inventory[]> {
    return await db
      .select()
      .from(inventory)
      .where(sql`current_stock <= min_stock`)
      .orderBy(asc(inventory.status), asc(inventory.name));
  }

  async getInventoryItem(id: number): Promise<Inventory | undefined> {
    const [item] = await db.select().from(inventory).where(eq(inventory.id, id));
    return item;
  }

  async createInventoryItem(item: InsertInventory): Promise<Inventory> {
    const [newItem] = await db
      .insert(inventory)
      .values(item)
      .returning();
    return newItem;
  }

  async updateInventoryItem(id: number, updates: Partial<InsertInventory>): Promise<Inventory> {
    const [updatedItem] = await db
      .update(inventory)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(inventory.id, id))
      .returning();
    return updatedItem;
  }

  // Transactions
  async getTransactions(userId: string, limit = 50): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.date))
      .limit(limit);
  }

  async getFinancialSummary(userId: string, months = 12): Promise<{
    totalRevenue: number;
    totalExpenses: number;
    profit: number;
    transactions: Transaction[];
  }> {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);

    const transactions = await db
      .select()
      .from(transactions)
      .where(sql`date >= ${cutoffDate}`)
      .orderBy(desc(transactions.date));

    const totalRevenue = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      totalRevenue,
      totalExpenses,
      profit: totalRevenue - totalExpenses,
      transactions,
    };
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  // Activities
  async getRecentActivities(userId: string, limit = 20): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db
      .insert(activities)
      .values(activity)
      .returning();
    return newActivity;
  }

  // Tasks
  async getTasks(userId: string, status?: string): Promise<Task[]> {
    let query = db
      .select()
      .from(tasks)
      .where(eq(tasks.assignedTo, userId));

    if (status) {
      query = query.where(eq(tasks.status, status));
    }

    return await query.orderBy(desc(tasks.createdAt));
  }

  async getTodaysTasks(userId: string): Promise<Task[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.assignedTo, userId),
          sql`due_date >= ${today}`,
          sql`due_date < ${tomorrow}`
        )
      )
      .orderBy(asc(tasks.dueDate));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db
      .insert(tasks)
      .values(task)
      .returning();
    return newTask;
  }

  async updateTask(id: number, updates: Partial<InsertTask>): Promise<Task> {
    const [updatedTask] = await db
      .update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  // Farm sectors
  async getFarmSectors(): Promise<FarmSector[]> {
    return await db
      .select()
      .from(farmSectors)
      .orderBy(asc(farmSectors.name));
  }

  async createFarmSector(sector: InsertFarmSector): Promise<FarmSector> {
    const [newSector] = await db
      .insert(farmSectors)
      .values(sector)
      .returning();
    return newSector;
  }
}

export const storage = new DatabaseStorage();
