import { execSync } from 'node:child_process'
import { vpc } from './vpc'
import { jwksUrl } from './auth'
import { connectionString, database } from './storage'
import { domain } from './domain'

// zero cluster
const zeroVersion = execSync(
  'npm list @rocicorp/zero | grep @rocicorp/zero | cut -f 3 -d @',
)
  .toString()
  .trim()

// S3 Bucket
const replicationBucket = new sst.aws.Bucket('zero-replication-bucket')

// VPC Configuration
// ECS Cluster
const cluster = new sst.aws.Cluster('cooked-cluster', {
  vpc,
})

// TODO: I think I can use the cognito jwks
// const zeroAuthSecret = new sst.Secret('ZeroAuthSecret')

console.log('using zero image: ', `rocicorp/zero:${zeroVersion}`)

// Common environment variables
const commonEnv = {
  ZERO_UPSTREAM_DB: connectionString,
  ZERO_CVR_DB: connectionString,
  ZERO_CHANGE_DB: connectionString,
  ZERO_AUTH_JWKS_URL: jwksUrl,
  ZERO_REPLICA_FILE: 'sync-replica.db',
  ZERO_LITESTREAM_BACKUP_URL: $interpolate`s3://${replicationBucket.name}/backup`,
  // TODO: IDK why the version isn't working
  // ZERO_IMAGE_URL: `rocicorp/zero:${zeroVersion}`,
  ZERO_IMAGE_URL: 'rocicorp/zero:0.16.2025022800',
  ZERO_CVR_MAX_CONNS: '10',
  ZERO_UPSTREAM_MAX_CONNS: '10',
}

// Replication Manager Service
export const replicationManagerService = new sst.aws.Service(
  'replication-manager',
  {
    cluster,
    capacity: 'spot',
    cpu: '0.25 vCPU',
    memory: '0.5 GB',
    architecture: 'arm64',
    image: commonEnv.ZERO_IMAGE_URL,
    link: [replicationBucket, database],
    serviceRegistry: {
      port: 4849,
    },
    health: {
      command: ['CMD-SHELL', 'curl -f http://localhost:4849/ || exit 1'],
      interval: '5 seconds',
      retries: 3,
      startPeriod: '300 seconds',
    },
    environment: {
      ...commonEnv,
      ZERO_CHANGE_MAX_CONNS: '3',
      ZERO_NUM_SYNC_WORKERS: '0',
    },
    // probably cheaper to expose through api gateway
    loadBalancer: {
      public: false,
      ports: [
        {
          listen: '80/http',
          forward: '4849/http',
        },
      ],
    },
    transform: {
      loadBalancer: {
        idleTimeout: 3600,
      },
      target: {
        // load balancer health check
        healthCheck: {
          enabled: true,
          path: '/keepalive',
          protocol: 'HTTP',
          interval: 5,
          healthyThreshold: 2,
          timeout: 3,
        },
      },
    },
  },
)

// View Syncer Service
export const viewSyncerService = new sst.aws.Service('view-syncer', {
  cluster,
  capacity: 'spot',
  cpu: '0.25 vCPU',
  memory: '0.5 GB',
  architecture: 'arm64',
  image: commonEnv.ZERO_IMAGE_URL,
  link: [replicationBucket, database],
  serviceRegistry: {
    port: 4848,
  },
  health: {
    command: ['CMD-SHELL', 'curl -f http://localhost:4848/ || exit 1'],
    interval: '5 seconds',
    retries: 3,
    startPeriod: '300 seconds',
  },
  environment: {
    ...commonEnv,
    ZERO_CHANGE_STREAMER_URI: replicationManagerService.url,
  },
  logging: {
    retention: '1 month',
  },
  // dev: {
  //   command: 'npx zero-cache-dev',
  // },
  // can I expose via api gateway???
  loadBalancer: {
    public: true,
    domain: `sync.${domain}`,
    rules: [
      { listen: '80/http', forward: '4848/http' },
      { listen: '443/https', forward: '4848/http' },
    ],
  },
  transform: {
    target: {
      // load balancer health check
      // TODO: Can I get rid of all this?
      // assuming I can expose through api gateway
      healthCheck: {
        enabled: true,
        path: '/keepalive',
        protocol: 'HTTP',
        interval: 5,
        healthyThreshold: 2,
        timeout: 3,
      },
      stickiness: {
        enabled: true,
        type: 'lb_cookie',
        cookieDuration: 120,
      },
      loadBalancingAlgorithmType: 'least_outstanding_requests',
    },
  },
})

export const viewSyncerEndpoint = $dev
  ? $util.output('http://localhost:4848')
  : viewSyncerService.url

// Permissions deployment
// Note: this setup requires your CI/CD pipeline to have access to your
// Postgres database. If you do not want to do this, you can also use
// `npx zero-deploy-permissions --output-format=sql` during build to
// generate a permissions.sql file, then run that file as part of your
// deployment within your VPC. See hello-zero-solid for an example:
// https://github.com/rocicorp/hello-zero-solid/blob/main/sst.config.ts#L141
new command.local.Command(
  'zero-deploy-permissions',
  {
    // WARN: uuuuh this path is scuffed
    create: 'npx zero-deploy-permissions -p ../../packages/db/zero-schema.ts',
    // Run the Command on every deploy ...
    triggers: [Date.now()],
    environment: {
      ZERO_UPSTREAM_DB: commonEnv.ZERO_UPSTREAM_DB,
    },
  },
  // after the view-syncer is deployed.
  { dependsOn: viewSyncerService },
)

export const zeroEnv = commonEnv

new sst.x.DevCommand('Zero', {
  environment: {
    ...commonEnv,
    // @ts-ignore
    ZERO_LITESTREAM_BACKUP_URL: undefined,
  },
  dev: {
    autostart: true,
    command: 'npx zero-cache-dev -p ./packages/db/zero-schema.ts',
  },
})
