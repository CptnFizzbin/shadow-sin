import { z } from "zod"
import { useFieldContext } from "#/integrations/tanstack-form/FieldContext.ts"

interface ErrorLike {
  message: string
}

function isErrorLike(value: unknown): value is ErrorLike {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  )
}

export const useFieldErrors = (): null | string[] => {
  const field = useFieldContext()
  const { errors } = field.getMeta()
  return errors.length === 0 ? null : errors.map(getErrorMessage)
}

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error
  if (isErrorLike(error)) return error.message
  if (error instanceof Error) return error.message
  if (error instanceof z.ZodError) return error.message

  console.error("Unknown error type:", error)
  return String(error)
}
