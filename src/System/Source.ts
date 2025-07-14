export type Source = { book: string; page: number } | "Homebrew"

export const formatSource = (source: Source): string => {
  if (typeof source === "string") return source
  return `${source.book} p.${source.page}`
}
