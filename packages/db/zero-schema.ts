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
} from '@rocicorp/zero'

// const recipes = table('recipe')
//   .columns({
//     id: number(),
//     name: string(),
//     servings: string(),
//     protein: string(),
//     carbs: string(),
//     fat: string(),
//     content: string(),
//   })
//   .primaryKey('id')

const counters = table('counters')
  .from('counter')
  .columns({
    id: number(),
    count: number(),
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

export const schema = createSchema({
  tables: [counters],
})

export type Schema = typeof schema
// export type Recipe = Row<typeof schema.tables.recipes>
export type Counter = Row<typeof schema.tables.counters>

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
    counters: ANYONE_CAN_DO_ANYTHING,
  }
})
