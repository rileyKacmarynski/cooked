export type UserSession = { id: string; email: string }
export type Tokens = {
  idToken?: string
  accessToken?: string
}

export type AuthService = {
  login: (
    email: string,
    password: string,
  ) => Promise<{
    user: UserSession | null
    changePassword: boolean
    error: boolean
  }>
  loginWithRedirect(): Promise<void>
  logout: () => Promise<void>
  changePassword: (password: string) => Promise<{ error: boolean }>
  getUser: () => Promise<UserSession | null>
  getSession: () => Promise<Tokens | null>
}
