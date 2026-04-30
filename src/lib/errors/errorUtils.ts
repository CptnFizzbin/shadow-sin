import { z } from "zod"

export interface ErrorLike {
  message: string
  stack?: string
}

const ErrorLikeSchema = z.object({
  message: z.string(),
  stack: z.string().optional(),
}) satisfies z.ZodType<ErrorLike>

const isErrorLike = (obj: unknown): obj is ErrorLike => {
  return ErrorLikeSchema.safeParse(obj).success
}

export const stringifyError = (error: unknown) => {
  if (typeof error === "string") return error
  if (error instanceof Error) return error.message
  if (isErrorLike(error)) return error.message
  return String(error)
}
