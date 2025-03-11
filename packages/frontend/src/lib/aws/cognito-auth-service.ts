import {
  signIn,
  signOut,
  getCurrentUser,
  fetchUserAttributes,
  confirmSignIn,
  signInWithRedirect,
  fetchAuthSession,
} from 'aws-amplify/auth'
import type { AuthService } from '../auth-servce'

export const authService: AuthService = {
  async loginWithRedirect() {
    await signInWithRedirect({ provider: 'Google' })
  },

  async login(email, password) {
    try {
      const result = await signIn({ username: email, password })

      if (
        result.nextStep.signInStep ===
        'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'
      ) {
        return {
          user: null,
          changePassword: true,
          error: false,
        }
      }

      const user = await getCurrentUser()

      return {
        user: {
          id: user.userId,
          email: user.username,
        },
        changePassword: false,
        error: false,
      }
    } catch (e) {
      console.error(e)
      return {
        user: null,
        changePassword: false,
        error: true,
      }
    }
  },
  async logout() {
    await signOut()
  },
  async changePassword(password: string) {
    try {
      await confirmSignIn({
        challengeResponse: password,
      })

      return { error: false }
    } catch (e) {
      console.error(e)
      await signOut()
      return { error: true }
    }
  },
  async getUser() {
    try {
      const { userId } = await getCurrentUser()
      const { email } = await fetchUserAttributes()

      if (!email) {
        throw new Error(`Unable to fetch email attribute for user ${userId}.`)
      }

      return {
        id: userId,
        email: email,
      }
    } catch (e) {
      console.error(e)
      return null
    }
  },
  async getSession() {
    try {
      const session = await fetchAuthSession()

      if (!session) {
        throw new Error('Unable to fetch session.')
      }

      return {
        idToken: session.tokens?.idToken?.toString(),
        accessToken: session.tokens?.accessToken?.toString(),
      }
    } catch (e) {
      console.error(e)
      return null
    }
  },
}
