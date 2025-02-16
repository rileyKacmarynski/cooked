import {
  table,
  string,
  number,
  createSchema,
  type Row,
  ANYONE_CAN,
  definePermissions,
  type ExpressionBuilder,
} from '@rocicorp/zero'

const recipes = table('recipes')
  .columns({
    id: number(),
    name: string(),
    servings: string(),
    protein: string(),
    carbs: string(),
    fat: string(),
    content: string(),
  })
  .primaryKey('id')

// example of how to map stuff
// const userPref = table("userPref")
//   // Map TS "userPref" to DB name "user_pref"
//   .from("user_pref")
//   .columns({
//     id: string(),
//     // Map TS "orgID" to DB name "org_id"
//     orgID: string().from("org_id"),
//   });

export const schema = createSchema(1, {
  tables: [recipes],
})

export type Schema = typeof schema
export type Recipe = Row<typeof schema.tables.recipes>

type AuthData = {
  sub: string | null
}

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
  return {
    recipes: {
      row: {
        select: ANYONE_CAN,
        insert: ANYONE_CAN,
        delete: ANYONE_CAN,
      },
    },
  }
})
