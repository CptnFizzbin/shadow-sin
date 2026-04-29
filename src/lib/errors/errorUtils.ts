export interface ErrorLike {
  message: string
  stack?: string
}

export const isErrorLike = (obj: unknown): obj is ErrorLike => {
  return typeof obj === "object"
    && obj !== null
    && "message" in obj
}

export const stringifyError = (error: unknown) => {
  if (typeof error === "string") return error
  if (error instanceof Error) return error.message
  if (isErrorLike(error)) return error.message
  return String(error)
}
