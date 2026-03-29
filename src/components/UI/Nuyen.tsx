import type { FC } from "react"

export function formatNuyen(amount: number): string {
  return `${amount.toLocaleString("en")}¥`
}

interface NuyenProps {
  amount: number | undefined
}

export const Nuyen: FC<NuyenProps> = ({ amount }) => formatNuyen(amount ?? 0)
