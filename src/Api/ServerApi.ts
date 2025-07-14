import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

import { ApiError } from "./ApiError"

const SERVER_URL = "https://"

export class ServerApi {
  private static axiosInstance: AxiosInstance = axios.create({
    baseURL: SERVER_URL,
    withCredentials: true,
  })

  public static get<R>(path: string, config?: AxiosRequestConfig): Promise<R> {
    return this.axiosInstance
      .get(path, config)
      .then((res) => res.data as R)
      .catch((error) => this.handleError(error))
  }

  public static post<R, D = unknown>(
    path: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.axiosInstance
      .post(path, data, config)
      .then((res) => res.data as R)
      .catch((error) => this.handleError(error))
  }

  private static async handleError<R>(error: unknown): Promise<R> {
    if (!axios.isAxiosError(error)) throw error
    if (!error.response) throw error
    throw error.response.data
  }

  public static isApiError(error: unknown): error is ApiError {
    return (error as ApiError).err !== undefined
  }
}
