const region = aws.getRegionOutput().name

export const userPool = new sst.aws.CognitoUserPool('UserPool', {
  usernames: ['email'],
  // I have no idea why this causes issues
  mfa: 'optional',
})

export const userPoolClient = userPool.addClient('UserPoolClient')

export const identityPool = new sst.aws.CognitoIdentityPool('IdentityPool', {
  userPools: [{ userPool: userPool.id, client: userPoolClient.id }],
  permissions: {
    authenticated: [
      // TODO: I'll have to give this guy permissions
      // To hit the zero-sync servers
      // {
      //   actions: ['execute-api:*'],
      //   resources: [
      //     $concat(
      //       'arn:aws:execute-api:',
      //       region,
      //       ':',
      //       aws.getCallerIdentityOutput({}).accountId,
      //       ':',
      //       api.nodes.api.id,
      //       '/*/*/*',
      //     ),
      //   ],
      // },
    ],
  },
})
