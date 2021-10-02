import { ServerApi } from '../Api/ServerApi'
import { User } from '../Api/User'

export const AuthApi = {
  signup (username: string, password: string): Promise<User> {
    return ServerApi
      .post<{ user: User }>('/signup', { username, password })
      .then(data => data.user)
  },

  login (username: string, password: string): Promise<User> {
    return ServerApi
      .post<{ user: User }>('/login', { username, password })
      .then(data => data.user)
  },

  logout (): Promise<never> {
    return ServerApi
      .post<never>('/logout')
  },

  fetchUser (): Promise<User> {
    return ServerApi.get<{ user: User }>('/user')
      .then(data => data.user)
  },
}
