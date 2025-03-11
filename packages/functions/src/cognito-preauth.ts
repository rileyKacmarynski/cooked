import type { Context, PreAuthenticationTriggerEvent } from 'aws-lambda'
import { Resource } from 'sst'

export async function handler(
  event: PreAuthenticationTriggerEvent,
  _: Context,
) {
  // Don't allow random people to sign in
  const emails = Resource.ALLOWED_EXTERNAL_EMAILS.value.split(';')
  if (
    event.userName.toLowerCase().startsWith('google') &&
    !emails.some((e) => e === event.request.userAttributes.email)
  ) {
    throw new Error('You are unauthorized to sign in.')
  }

  return event
}
