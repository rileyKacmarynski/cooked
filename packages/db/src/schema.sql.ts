import { serial, integer, pgTable } from 'drizzle-orm/pg-core'

export const counter = pgTable('counter', {
  id: serial('id').primaryKey(),
  count: integer('count').notNull().default(0),
})
