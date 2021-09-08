import { AxiosError } from 'axios'
import { createContext, FC, useContext, useEffect, useState } from 'react'

import { ServerApi } from '../Api/ServerApi'
import { User } from '../Api/User'
import { noOp } from '../Helpers'
import { AuthApi, AuthToken } from './AuthApi'

const SESSION_KEY = 'auth.token'

interface AuthContextState {
  user: User | null
  message: string | null
  authorizing: boolean

  authorize (username: string, password: string): void
}

const AuthContext = createContext<AuthContextState>({
  user: null,
  message: null,
  authorizing: false,
  authorize: noOp,
})
export const AuthProvider: FC = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [authToken, setAuthToken] = useState<AuthToken | null>(localStorage.getItem(SESSION_KEY) || null)
  const [authorizing, setAuthorizing] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)

  const authorize = (username: string, password: string) => {
    setAuthorizing(true)
    setMessage('Authorizing...')
    AuthApi.login(username, password)
      .then(authToken => setAuthToken(authToken))
      .catch(handleError)
  }

  const handleError = (error: AxiosError) => {
    if (error.response) {
      setAuthorizing(false)
      setMessage(error.response.data.error.message)
    } else {
      throw error
    }
  }

  useEffect(() => {
    localStorage.setItem(SESSION_KEY, authToken || '')
    ServerApi.authToken = authToken

    if (ServerApi.authToken) {
      setAuthorizing(true)
      setMessage('Authorizing...')
      AuthApi.fetchUser()
        .then(user => setUser(user))
        .then(() => setAuthorizing(false))
        .catch(handleError)
    }
  }, [authToken])

  const state: AuthContextState = {
    user,
    message,
    authorizing,
    authorize,
  }

  return (
    <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
  )
}

export const useCurrentUser = (): User | null => {
  return useContext(AuthContext).user
}

export const useAuth = (): AuthContextState => {
  return useContext(AuthContext)
}
