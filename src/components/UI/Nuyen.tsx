import type { FC } from "react"

export function formatNuyen(amount: number): string {
  return `${amount.toLocaleString("en")}¥`
}

interface NuyenProps {
  amount: number
}

export const Nuyen: FC<NuyenProps> = ({ amount }) => formatNuyen(amount)
