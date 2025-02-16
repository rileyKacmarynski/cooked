export const vpc = new sst.aws.Vpc('Main', {
  bastion: true,
  nat: 'ec2',
  az: 2,
})
