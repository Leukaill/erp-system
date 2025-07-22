import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  date,
  uuid
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Local Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password"), // For local auth
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("farm_manager"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // maize, coffee, etc.
  location: text("location").notNull(),
  status: varchar("status").notNull().default("planning"), // planning, active, completed, on_hold
  progress: integer("progress").default(0), // 0-100
  startDate: date("start_date"),
  endDate: date("end_date"),
  budget: decimal("budget", { precision: 15, scale: 2 }),
  spent: decimal("spent", { precision: 15, scale: 2 }).default("0"),
  managerId: varchar("manager_id").references(() => users.id),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Inventory items table
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: varchar("category").notNull(), // seeds, fertilizers, equipment, etc.
  currentStock: decimal("current_stock", { precision: 10, scale: 2 }).notNull(),
  minStock: decimal("min_stock", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit").notNull(), // kg, liters, pieces, etc.
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
  supplierId: integer("supplier_id"),
  location: text("location"),
  status: varchar("status").default("active"), // active, low, critical, out_of_stock
  lastRestocked: timestamp("last_restocked"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Financial transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  type: varchar("type").notNull(), // income, expense
  category: varchar("category").notNull(), // seeds, labor, equipment, sales, etc.
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency").default("RWF"),
  description: text("description"),
  projectId: integer("project_id").references(() => projects.id),
  date: timestamp("date").notNull(),
  receipt: text("receipt"), // file path or URL
  status: varchar("status").default("completed"), // pending, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Activities table for activity feed
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: varchar("type").notNull(), // project_update, inventory_alert, financial, etc.
  title: text("title").notNull(),
  description: text("description"),
  entityType: varchar("entity_type"), // project, inventory, transaction
  entityId: integer("entity_id"),
  userId: varchar("user_id").references(() => users.id),
  priority: varchar("priority").default("medium"), // low, medium, high, critical
  status: varchar("status").default("unread"), // read, unread
  createdAt: timestamp("created_at").defaultNow(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  priority: varchar("priority").default("medium"), // low, medium, high, critical
  status: varchar("status").default("pending"), // pending, in_progress, completed, cancelled
  assignedTo: varchar("assigned_to").references(() => users.id),
  projectId: integer("project_id").references(() => projects.id),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Farm sectors table
export const farmSectors = pgTable("farm_sectors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  area: decimal("area", { precision: 10, scale: 2 }).notNull(), // in hectares
  location: text("location"),
  cropType: varchar("crop_type"),
  status: varchar("status").default("active"), // active, harvesting, maintenance, fallow
  coordinates: jsonb("coordinates"), // lat/lng for mapping
  currentProjectId: integer("current_project_id").references(() => projects.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  tasks: many(tasks),
  activities: many(activities),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  manager: one(users, {
    fields: [projects.managerId],
    references: [users.id],
  }),
  transactions: many(transactions),
  tasks: many(tasks),
  farmSectors: many(farmSectors),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  project: one(projects, {
    fields: [transactions.projectId],
    references: [projects.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  assignee: one(users, {
    fields: [tasks.assignedTo],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}));

export const farmSectorsRelations = relations(farmSectors, ({ one }) => ({
  currentProject: one(projects, {
    fields: [farmSectors.currentProjectId],
    references: [projects.id],
  }),
}));

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertProject = typeof projects.$inferInsert;
export type Project = typeof projects.$inferSelect;

export type InsertInventory = typeof inventory.$inferInsert;
export type Inventory = typeof inventory.$inferSelect;

export type InsertTransaction = typeof transactions.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;

export type InsertActivity = typeof activities.$inferInsert;
export type Activity = typeof activities.$inferSelect;

export type InsertTask = typeof tasks.$inferInsert;
export type Task = typeof tasks.$inferSelect;

export type InsertFarmSector = typeof farmSectors.$inferInsert;
export type FarmSector = typeof farmSectors.$inferSelect;

// Zod schemas
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertFarmSectorSchema = createInsertSchema(farmSectors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// User authentication schemas
export const registerUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  password: z.string().min(6),
}).pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
