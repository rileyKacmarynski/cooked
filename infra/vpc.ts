export const vpc = new sst.aws.Vpc('Main', {
  bastion: true,
  nat: 'ec2',
  az: 2,
})

// export const vpc =
//   $app.stage === 'production'
//     ? new sst.aws.Vpc('Main', {
//         bastion: true,
//         nat: 'ec2',
//         az: 2,
//       })
//     : sst.aws.Vpc.get('Main', '')
