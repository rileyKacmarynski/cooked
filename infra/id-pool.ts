import { provider, userPool } from './auth'
import { viewSyncerService } from './zero-sync-engine'
import { appUrl } from './domain'

const region = aws.getRegionOutput().name

export const userPoolClient = userPool.addClient('Web', {
  providers: [provider.providerName],
  transform: {
    client: {
      callbackUrls: [appUrl],
      logoutUrls: [appUrl],
    },
  },
})

// TODO: THIS SHIT NEEDS TO GO AH GOT A CIRCULAR DEPENDENCY
export const identityPool = new sst.aws.CognitoIdentityPool('IdentityPool', {
  userPools: [{ userPool: userPool.id, client: userPoolClient.id }],
  permissions: {
    authenticated: [
      // {
      //   effect: 'Allow',
      //   actions: ['elasticloadbalancing:DescribeLoadBalancers'],
      //   resources: ['*'],
      // },
      // TODO: I'll have to give this guy permissions
      // To hit the zero-sync servers
      {
        actions: ['execute-api:*'],
        resources: [
          $concat(
            'arn:aws:execute-api:',
            region,
            ':',
            aws.getCallerIdentityOutput({}).accountId,
            ':',
            viewSyncerService.nodes.loadBalancer.arn,
            '/*/*/*',
          ),
        ],
      },
    ],
  },
})
