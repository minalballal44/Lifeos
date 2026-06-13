import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  uuid,
  date,
  varchar,
} from "drizzle-orm/pg-core";

// Users / Profiles
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("student"), // student, professional, entrepreneur, etc.
  goals: jsonb("goals").$type<string[]>().default([]),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  streak: integer("streak").notNull().default(0),
  theme: text("theme").notNull().default("dark"),
  onboarded: boolean("onboarded").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tasks
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  status: text("status").notNull().default("todo"), // todo, in_progress, done
  category: text("category"),
  tags: jsonb("tags").$type<string[]>().default([]),
  dueDate: timestamp("due_date"),
  recurring: text("recurring"), // daily, weekly, monthly
  parentId: uuid("parent_id"),
  sortOrder: integer("sort_order").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Goals
export const goals = pgTable("goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull().default("monthly"), // weekly, monthly, quarterly, yearly, 3year, 5year
  category: text("category"),
  progress: integer("progress").notNull().default(0),
  target: integer("target").notNull().default(100),
  milestones: jsonb("milestones").$type<{ title: string; done: boolean }[]>().default([]),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Habits
export const habits = pgTable("habits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  icon: text("icon").notNull().default("⭐"),
  color: text("color").notNull().default("#8B5CF6"),
  frequency: text("frequency").notNull().default("daily"), // daily, weekly
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  totalCompletions: integer("total_completions").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Habit Logs
export const habitLogs = pgTable("habit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  habitId: uuid("habit_id").references(() => habits.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  completed: boolean("completed").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Journal Entries
export const journals = pgTable("journals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull().default("daily"), // daily, gratitude, reflection, success, mood
  mood: text("mood"), // great, good, okay, sad, stressed
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Mood Entries
export const moods = pgTable("moods", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  mood: text("mood").notNull(), // great, good, okay, sad, stressed
  note: text("note"),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Focus Sessions
export const focusSessions = pgTable("focus_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  duration: integer("duration").notNull(), // minutes
  type: text("type").notNull().default("pomodoro"), // pomodoro, deep_work
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

// Knowledge Vault
export const notes = pgTable("notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull().default("note"), // note, idea, quote, resource, book, course
  tags: jsonb("tags").$type<string[]>().default([]),
  pinned: boolean("pinned").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Achievements
export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon").notNull().default("🏆"),
  xpReward: integer("xp_reward").notNull().default(50),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

// Daily Planner
export const plannerBlocks = pgTable("planner_blocks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  startTime: varchar("start_time", { length: 5 }).notNull(),
  endTime: varchar("end_time", { length: 5 }).notNull(),
  date: date("date").notNull(),
  color: text("color").notNull().default("#8B5CF6"),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
