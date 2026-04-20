import type { FC } from "react"

export function formatNuyen(amount: number, options?: { includeSymbol?: boolean }): string {
  const formatted = amount.toLocaleString("en")
  return (options?.includeSymbol ?? true) ? `${formatted}¥` : formatted
}

interface NuyenProps {
  amount: number | undefined
}

export const Nuyen: FC<NuyenProps> = ({ amount }) => formatNuyen(amount ?? 0)
