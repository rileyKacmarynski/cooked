// don't need the api for now
// import { openAiKey } from './secrets'
// import { table } from './storage'
//
// const domain = 'api.listings-app.com'
//
// export const api = new sst.aws.ApiGatewayV2('Api', {
//   domain: $app.stage === 'production' ? domain : undefined,
//   cors: {
//     allowOrigins:
//       $app.stage === 'production' ? ['https://listings-app.com'] : ['*'],
//   },
//   transform: {
//     route: {
//       handler: {
//         link: [openAiKey, table],
//       },
//     },
//   },
// })
//
// api.route(
//   '$default',
//   {
//     handler: 'packages/api/src/api.handler',
//   },
//   {
//     auth: { iam: true },
//   },
// )
//
// api.route('OPTIONS /{proxy+}', {
//   handler: 'packages/api/src/api.handler',
// })
