import {
  GoogleClientId,
  GoogleClientSecret,
  AllowedExternalEmails,
} from './secrets'
import aws from '@pulumi/aws'
import { all } from '@pulumi/pulumi'

const region = aws.getRegionOutput().name

const preAuthFunction = new sst.aws.Function('PreAuthHandler', {
  handler: 'packages/functions/src/cognito-preauth.handler',
  link: [AllowedExternalEmails],
})

export const userPool = new sst.aws.CognitoUserPool('Users', {
  // not specifying this causes weird flakey errors
  // mfa: 'optional',
  triggers: {
    preAuthentication: preAuthFunction.arn,
  },
})
const provider = userPool.addIdentityProvider('Google', {
  type: 'google',
  details: {
    authorize_scopes: 'email openid profile',
    client_id: GoogleClientId.value,
    client_secret: GoogleClientSecret.value,
  },
  attributes: {
    email: 'email',
    name: 'name',
    username: 'sub',
  },
})

export const jwksUrl = $interpolate`https://${userPool.nodes.userPool.endpoint}/.well-known/jwks.json`

const userPoolDomain = new aws.cognito.UserPoolDomain('Cooked', {
  userPoolId: userPool.id,
  domain: `${$app.stage}-auth`,
})

export const domain = all([userPoolDomain.domain, region]).apply(
  ([domain, region]) => `${domain}.auth.${region}.amazoncognito.com`,
)

export const userPoolClient = userPool.addClient('Web', {
  providers: [provider.providerName],
  transform: {
    client: {
      callbackUrls: ['http://localhost:3002'],
      logoutUrls: ['http://localhost:3002'],
    },
  },
})

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
