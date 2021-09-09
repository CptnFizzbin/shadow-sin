import { createContext, FC, useContext, useState } from 'react'

import { User } from '../Api/User'
import { AuthApi } from './AuthApi'

interface AuthContextState {
  user: User | null

  login (username: string, password: string): Promise<User>

  fetchUser (): Promise<User>

  logout (username: string, password: string): Promise<void>
}

const AuthContext = createContext<AuthContextState>({
  user: null,
  login: () => { throw new Error('Invalid AuthContext') },
  fetchUser: () => { throw new Error('Invalid AuthContext') },
  logout: () => { throw new Error('Invalid AuthContext') },
})

export const AuthProvider: FC = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)

  const login = (username: string, password: string) => {
    return AuthApi.login(username, password).then(user => {
      setUser(user)
      return user
    })
  }

  const fetchUser = (): Promise<User> => {
    return AuthApi.fetchUser().then(user => {
      setUser(user)
      return user
    })
  }

  const logout = () => {
    setUser(null)
    return AuthApi.logout()
  }

  const state: AuthContextState = {
    user,
    fetchUser,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextState => {
  return useContext(AuthContext)
}

export const useCurrentUser = (): User | null => {
  return useAuth().user
}
