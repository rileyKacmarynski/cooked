export const vpc = new sst.aws.Vpc('Vpc', {
  bastion: true,
  nat: 'ec2',
  az: 2,
})

export const database = new sst.aws.Postgres('Database', {
  vpc,
  proxy: false,
  database: 'cooked',
})
