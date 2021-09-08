import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { AuthToken } from '../Auth/AuthApi'

const SERVER_URL = process.env.REACT_APP_SERVER_URL

export class ServerApi {
  private static axiosInstance: AxiosInstance = axios.create({ baseURL: SERVER_URL })

  public static get authToken (): AuthToken | null {
    const [, token] = this.axiosInstance.defaults.headers['Authorization']?.split(' ') || [null, null]
    return token
  }

  public static set authToken (authToken: AuthToken | null) {
    let authHeader = null

    if (authToken) authHeader = `Bearer ${authToken}`

    this.axiosInstance.defaults.headers['Authorization'] = authHeader
  }

  public static get<R> (path: string, config: AxiosRequestConfig = {}): Promise<R> {
    return this.axiosInstance.get(path, config)
      .then(res => res.data as R)
  }

  public static post<D, R> (path: string, data: D, config: AxiosRequestConfig = {}): Promise<R> {
    return this.axiosInstance.post(path, data, config)
      .then(res => res.data as R)
  }
}
