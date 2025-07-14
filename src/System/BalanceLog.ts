export type BalanceLog = LogEntry[]

export interface LogEntry {
  date: string
  note: string
  value: number
}
