import { relations } from 'drizzle-orm'
import {
  serial,
  integer,
  pgTable,
  timestamp,
  text,
  primaryKey,
} from 'drizzle-orm/pg-core'

const timestamps = {
  updatedAt: timestamp('updated_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}

export const ingredients = pgTable('ingredients', {
  id: serial().primaryKey(),
  name: text().notNull(),

  ...timestamps,
})

export const ingredientRelations = relations(ingredients, ({ many }) => ({
  recipeIngredients: many(recipeIngredients),
}))

export const recipes = pgTable('recipes', {
  id: serial().primaryKey(),
  name: text(),
  servings: integer(),
  protein: integer(),
  carbs: integer(),
  fat: integer(),
  imageUrl: text(),

  ...timestamps,
})
export const recipeRelations = relations(recipes, ({ many }) => ({
  instructions: many(recipeInstructions),
  ingredients: many(recipeIngredients),
}))

export const recipeInstructions = pgTable('recipe_instructions', {
  id: serial().primaryKey(),
  recipeId: integer('recipe_id').references(() => recipes.id, {
    onDelete: 'cascade',
  }),
  step: integer(),
  text: text(),

  ...timestamps,
})
export const recipeInstructionsRelations = relations(
  recipeInstructions,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [recipeInstructions.recipeId],
      references: [recipes.id],
    }),
  }),
)

export const recipeIngredients = pgTable(
  'recipe_ingredients',
  {
    recipeId: integer('recipe_id').references(() => recipes.id, {
      onDelete: 'cascade',
    }),
    ingredientId: integer('ingredient_id').references(() => ingredients.id, {
      onDelete: 'cascade',
    }),
    // NOTE: Not worrying about units because hard
    amount: text(),

    ...timestamps,
  },
  (table) => [primaryKey({ columns: [table.recipeId, table.ingredientId] })],
)
export const recipeIngredientsRelations = relations(
  recipeIngredients,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [recipeIngredients.recipeId],
      references: [recipes.id],
    }),
    ingredient: one(ingredients, {
      fields: [recipeIngredients.ingredientId],
      references: [ingredients.id],
    }),
  }),
)
