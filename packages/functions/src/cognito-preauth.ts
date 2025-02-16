import type {
  Callback,
  Context,
  PreAuthenticationTriggerEvent,
} from 'aws-lambda'
import { Resource } from 'sst'

// TODO: I don't actually know if this is working. Seems to be though
export async function handler(
  event: PreAuthenticationTriggerEvent,
  _: Context,
  callback: Callback,
) {
  // Don't allow random people to sign in
  const emails = Resource.ALLOWED_EXTERNAL_EMAILS.value.split(';')
  if (
    event.userName.toLowerCase().startsWith('google') &&
    !emails.some((e) => e === event.request.userAttributes.email)
  ) {
    return callback(new Error('You are unauthorized to sign in.'))
  }

  return callback(null, event)
}
