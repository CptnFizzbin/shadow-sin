import { createContext, FC, useContext, useEffect, useState } from 'react'

import { AuthApi } from './AuthApi'
import { User } from './User'

interface AuthContextState {
  user: User | null
  fetching: boolean

  login (username: string, password: string): Promise<User>

  signup (username: string, password: string): Promise<User>

  fetchUser (): Promise<User>

  logout (): Promise<void>
}

const AuthContext = createContext<AuthContextState>({
  user: null,
  fetching: false,
  login: () => { throw new Error('Invalid AuthContext') },
  signup: () => { throw new Error('Invalid AuthContext') },
  fetchUser: () => { throw new Error('Invalid AuthContext') },
  logout: () => { throw new Error('Invalid AuthContext') },
})

export const AuthProvider: FC = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [fetching, setFetching] = useState<boolean>(false)

  const login = (username: string, password: string) => {
    return AuthApi.login(username, password).then(user => {
      setUser(user)
      return user
    })
  }

  const signup = (username: string, password: string) => {
    return AuthApi.signup(username, password).then(user => {
      setUser(user)
      return user
    })
  }

  const fetchUser = (): Promise<User> => {
    setFetching(true)
    return AuthApi.fetchUser()
      .then(user => {
        setUser(user)
        return user
      })
      .finally(() => setFetching(false))
  }

  const logout = () => {
    setUser(null)
    return AuthApi.logout()
  }

  const state: AuthContextState = {
    user,
    fetching,
    fetchUser,
    signup,
    login,
    logout,
  }

  useEffect(() => {
    fetchUser().catch(console.error)
  }, [])

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
