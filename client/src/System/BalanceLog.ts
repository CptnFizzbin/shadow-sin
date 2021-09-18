export type BalanceLog = LogEntry[]

export interface LogEntry {
  date: string
  id: string
  note: string
  value: number
}
