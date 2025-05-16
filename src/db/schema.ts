import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const runes = sqliteTable('Rune', {
  id: text('id').primaryKey(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  grade: text('grade').notNull(),
  classes: text('classes').notNull(),
  effect: text('effect').notNull(),
  duration: integer('duration'),
  cooldown: integer('cooldown'),
  obtainMethod: text('obtainMethod').notNull(),
  imageUrl: text('imageUrl'),
  recommendedCombinations: text('recommendedCombinations').notNull(),
  stats: text('stats'),
  description: text('description'),
  usage: text('usage'),
  notes: text('notes').notNull(),
  tradeable: integer('tradeable', { mode: 'boolean' }).notNull().default(true),
  weight: integer('weight'),
  curseRate: real('curseRate'),
  epicAchievement: text('epicAchievement'),
});

export const runeComments = sqliteTable('RuneComment', {
  id: text('id').primaryKey(),
  runeId: text('runeId').notNull(),
  userId: text('userId').notNull(),
  userName: text('userName').notNull(),
  content: text('content').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  isBlinded: integer('isBlinded', { mode: 'boolean' }).notNull().default(false),
  likes: integer('likes').notNull().default(0),
});

export const runeGuides = sqliteTable('RuneGuide', {
  id: text('id').primaryKey(),
  runeId: text('runeId').notNull().unique(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  obtainMethods: text('obtainMethods').notNull(),
  recommendedParty: text('recommendedParty'),
  tips: text('tips').notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export const gameServers = sqliteTable('GameServer', {
  id: text('id').primaryKey(),
  game: text('game').notNull(),
  name: text('name').notNull(),
  status: text('status').notNull(),
  population: integer('population').notNull(),
  region: text('region').notNull(),
  maintenanceMessage: text('maintenanceMessage'),
  maintenanceEndTime: text('maintenanceEndTime'),
  lastChecked: integer('lastChecked', { mode: 'timestamp' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export const gameEvents = sqliteTable('GameEvent', {
  id: text('id').primaryKey(),
  game: text('game').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  startDate: integer('startDate', { mode: 'timestamp' }).notNull(),
  endDate: integer('endDate', { mode: 'timestamp' }).notNull(),
  imageUrl: text('imageUrl'),
  url: text('url'),
  rewards: text('rewards'),
  isSpecial: integer('isSpecial', { mode: 'boolean' }).notNull().default(false),
  category: text('category').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

// 관계 정의 (예시)
export const runesRelations = relations(runes, ({ many }) => ({
  comments: many(runeComments, { relationName: 'RuneToRuneComment' }),
}));

export const runeCommentsRelations = relations(runeComments, ({ one }) => ({
  rune: one(runes, {
    fields: [runeComments.runeId],
    references: [runes.id],
    relationName: 'RuneToRuneComment',
  }),
}));
