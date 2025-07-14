import { parseISO } from "date-fns"

import { BalanceLog } from "./BalanceLog"

const nuyenFormatter = new Intl.NumberFormat("en")
export const formatNuyen = (cost: number): string => {
  return nuyenFormatter.format(cost) + " ¥"
}

export const calcNuyenBalance = (nuyen: BalanceLog): number => {
  return nuyen
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .reduce((sum, entry) => sum + entry.value, 0)
}
