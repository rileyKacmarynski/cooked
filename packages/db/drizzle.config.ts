import { Resource } from 'sst'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: ['./**/*.sql.ts'],
  out: './migrations',
  dbCredentials: {
    host: Resource.Postgres.host,
    port: Resource.Postgres.port,
    user: Resource.Postgres.username,
    password: Resource.Postgres.password,
    database: Resource.Postgres.database,
    ssl: Resource.Postgres.host === 'localhost' ? undefined : 'require',
  },
})
