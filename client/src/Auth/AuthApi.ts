import { ServerApi } from '../Api/ServerApi'
import { User } from '../Api/User'

export type AuthToken = string

interface LoginData {
  username: string
  password: string
}

interface LoginResponse {
  authToken: AuthToken
}

interface FetchUserResponse {
  user: User
}

export const AuthApi = {
  login (username: string, password: string): Promise<AuthToken> {
    return ServerApi
      .post<LoginData, LoginResponse>('/login', { username, password })
      .then(data => data.authToken)
  },

  fetchUser (): Promise<User> {
    return ServerApi
      .get<FetchUserResponse>('/user')
      .then(data => data.user)
  },
}
