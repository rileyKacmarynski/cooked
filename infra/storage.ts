import { vpc } from './vpc'

export const database = new sst.aws.Postgres('Postgres', {
  vpc,
  proxy: false,
  database: 'cooked',
})
