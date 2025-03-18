// export const vpc = new sst.aws.Vpc('Main', {
//   bastion: true,
//   nat: 'ec2',
//   az: 2,
// })

export const vpc =
  $app.stage === 'production' || !process.env.VPC
    ? new sst.aws.Vpc('Main', {
        bastion: true,
        nat: 'ec2',
        az: 2,
      })
    : sst.aws.Vpc.get('Main', process.env.VPC)
