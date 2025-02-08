import { createContext, use } from 'react'
import type { UserSession } from './auth-servce'

const userContext = createContext<UserSession | null>(null)

export default function UserProvider({
  children,
  user,
}: { children: React.ReactNode; user: UserSession }) {
  return <userContext.Provider value={user}>{children}</userContext.Provider>
}

export function useUser() {
  const context = use(userContext)

  if (!context) {
    throw new Error('useUser must be used inside a UserProvider')
  }

  return context
}
