import { vpc } from './vpc'

// function createDb(name: string) {
//   return new sst.aws.Postgres(name, {
//     vpc,
//     proxy: false,
//     database: 'cooked',
//     transform: {
//       parameterGroup: {
//         parameters: [
//           {
//             name: 'rds.logical_replication',
//             value: '1',
//             applyMethod: 'pending-reboot',
//           },
//           {
//             name: 'rds.force_ssl',
//             value: '0',
//             applyMethod: 'pending-reboot',
//           },
//           {
//             name: 'max_connections',
//             value: '1000',
//             applyMethod: 'pending-reboot',
//           },
//           {
//             name: 'max_slot_wal_keep_size',
//             value: '2048',
//             applyMethod: 'pending-reboot',
//           },
//         ],
//       },
//     },
//   })
// }
//
// const database =
//   $app.stage === 'production'
//     ? createDb('Postgres')
//     : sst.aws.Postgres.get('Postgres', { id: '' })

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
        {
          name: 'max_slot_wal_keep_size',
          value: '2048',
          applyMethod: 'pending-reboot',
        },
      ],
    },
  },
})

new sst.x.DevCommand('Drizzle', {
  link: [database],
  dev: {
    autostart: true,
    command: 'npx drizzle-kit studio --config=./packages/db/drizzle.config.ts',
  },
})

export const connectionString = $interpolate`postgresql://${database.username}:${database.password}@${database.host}/${database.database}`
