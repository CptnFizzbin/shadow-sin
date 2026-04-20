import type { FC } from "react"

export function formatNuyen(amount: number, includeSymbol = true): string {
  const formatted = amount.toLocaleString("en")
  return includeSymbol ? `${formatted}¥` : formatted
}

interface NuyenProps {
  amount: number | undefined
}

export const Nuyen: FC<NuyenProps> = ({ amount }) => formatNuyen(amount ?? 0)
