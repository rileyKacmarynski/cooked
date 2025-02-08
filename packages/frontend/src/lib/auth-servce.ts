export type UserSession = { id: string; email: string }

export type AuthService = {
  login: (
    email: string,
    password: string,
  ) => Promise<{
    user: UserSession | null
    changePassword: boolean
    error: boolean
  }>
  logout: () => Promise<void>
  changePassword: (password: string) => Promise<{ error: boolean }>
  getUser: () => Promise<UserSession | null>
}
