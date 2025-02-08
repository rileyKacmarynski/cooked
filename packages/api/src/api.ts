import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import type { LambdaContext, LambdaEvent } from 'hono/aws-lambda'
import { handle } from 'hono/aws-lambda'
import { cors } from 'hono/cors'
import * as z from 'zod'

type Bindings = {
  event: LambdaEvent
  lambdaContext: LambdaContext
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(
  '*',
  cors({
    origin: ['*'],
    allowHeaders: ['*'],
    allowMethods: ['*'],
    credentials: true,
  }),
)
// just going to leave this here in case I need it
// c.env.event.requestContext.authorizer?.iam.cognitoIdentity.identityId
app.get('/', async (c) => {
  const userId =
    // @ts-ignore
    c.env.event.requestContext.authorizer?.iam.cognitoIdentity.identityId
  return c.json({ userId })
})

const postItems = app.post(
  '/',
  zValidator(
    'json',
    z.object({
      items: z.array(z.string()).nonempty('items must not be empty.'),
    }),
  ),
  async (c) => {
    const { items } = c.req.valid('json')

    return c.json({ data: items })
  },
)

export type PostItems = typeof postItems

export const handler = handle(app)
