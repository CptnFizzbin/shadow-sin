import { format, parseISO } from "date-fns"

export const noOp = (): void => {
  /* No Operation */
}

export function formatDate(date: Date | string): string {
  if (typeof date === "string") date = parseISO(date)
  return format(date, "PP")
}
