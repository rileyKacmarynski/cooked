import { vpc } from './vpc'

export const database = new sst.aws.Postgres('Postgres', {
  vpc,
  proxy: false,
  database: 'cooked',
  transform: {
    parameterGroup: {
      parameters: [
        {
          name: 'rds.logical_replication',
          value: '1',
          applyMethod: 'pending-reboot',
        },
        {
          name: 'rds.force_ssl',
          value: '0',
          applyMethod: 'pending-reboot',
        },
        {
          name: 'max_connections',
          value: '1000',
          applyMethod: 'pending-reboot',
        },
      ],
    },
  },
})

// zero cluster
export const cluster = new sst.aws.Cluster('Cluster', { vpc })
export const connection = $interpolate`postgres://${database.username}:${database.password}@${database.host}:${database.port}`
cluster.addService('Zero', {
  image: 'rocicorp/zero',
  dev: {
    command: 'bunx zero-cache-dev',
  },
  loadBalancer: {
    ports: [{ listen: '80/http', forward: '4848/http' }],
  },
  environment: {
    ZERO_SCHEMA_PATH: 'packages/db/schema.ts',
    ZERO_UPSTREAM_DB: $interpolate`${connection}/${database.database}`,
    ZERO_CVR_DB: $interpolate`${connection}`,
    ZERO_CHANGE_DB: $interpolate`${connection}`,
    ZERO_REPLICA_FILE: 'zero.db',
    ZERO_NUM_SYNC_WORKERS: '1',
  },
})
