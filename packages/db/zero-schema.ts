import {
  table,
  string,
  number,
  createSchema,
  type Row,
  ANYONE_CAN,
  definePermissions,
  type ExpressionBuilder,
  ANYONE_CAN_DO_ANYTHING,
  relationships,
} from '@rocicorp/zero'

const timestamps = {
  updatedAt: number().from('updated_at'),
  createdAt: number().from('created_at'),
}

const recipes = table('recipes')
  .columns({
    id: number(),
    name: string(),
    servings: number(),
    protein: number(),
    carbs: number(),
    fat: number(),
    ...timestamps,
  })
  .primaryKey('id')

const recipeIngredients = table('recipeIngredients')
  .from('recipe_ingredients')
  .columns({
    recipeId: number().from('recipe_id'),
    ingredientId: number().from('ingredient_id'),
    amount: string(),
  })
  .primaryKey('recipeId', 'ingredientId')

const ingredients = table('ingredients')
  .columns({
    id: number(),
    name: string(),
    ...timestamps,
  })
  .primaryKey('id')

const recipeInstructions = table('recipeInstructions')
  .from('recipe_instructions')
  .columns({
    id: number(),
    recipeId: number().from('recipe_id'),
    step: number(),
    text: string(),
    ...timestamps,
  })
  .primaryKey('id')

const recipeRelations = relationships(recipes, ({ many }) => ({
  ingredients: many(
    {
      sourceField: ['id'],
      destSchema: recipeIngredients,
      destField: ['recipeId'],
    },
    {
      sourceField: ['ingredientId'],
      destSchema: ingredients,
      destField: ['id'],
    },
  ),
  instructions: many({
    sourceField: ['id'],
    destSchema: recipeInstructions,
    destField: ['recipeId'],
  }),
}))

const recipeInstructionsRelations = relationships(
  recipeInstructions,
  ({ one }) => ({
    recipes: one({
      sourceField: ['recipeId'],
      destSchema: recipes,
      destField: ['id'],
    }),
  }),
)

const ingredientRelations = relationships(ingredients, ({ many }) => ({
  recipeIngredients: many({
    sourceField: ['id'],
    destSchema: recipeIngredients,
    destField: ['ingredientId'],
  }),
}))

const recipeIngredientsRelations = relationships(
  recipeIngredients,
  ({ many }) => ({
    recipes: many({
      sourceField: ['recipeId'],
      destSchema: recipes,
      destField: ['id'],
    }),
    ingredients: many({
      sourceField: ['ingredientId'],
      destSchema: ingredients,
      destField: ['id'],
    }),
  }),
)

export const schema = createSchema({
  tables: [recipes, recipeIngredients, ingredients, recipeInstructions],
  relationships: [
    recipeInstructionsRelations,
    recipeIngredientsRelations,
    ingredientRelations,
    recipeRelations,
  ],
})

export type Schema = typeof schema
export type Recipe = Row<typeof schema.tables.recipes>
export type RecipeIngredient = Row<typeof schema.tables.recipeIngredients>
export type Ingredient = Row<typeof schema.tables.ingredients>
export type RecipeInstruction = Row<typeof schema.tables.recipeInstructions>

type AuthData = {
  sub: string | null
}

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
  return {
    // recipes: {
    //   row: {
    //     select: ANYONE_CAN,
    //     insert: ANYONE_CAN,
    //     delete: ANYONE_CAN,
    //   },
    // },
    ingredients: ANYONE_CAN_DO_ANYTHING,
    recipeIngredients: ANYONE_CAN_DO_ANYTHING,
    recipes: ANYONE_CAN_DO_ANYTHING,
    recipeInstructions: ANYONE_CAN_DO_ANYTHING,
  }
})
