import type { UUID } from "node:crypto"

export interface ContactData {
  id: UUID
  name: string

  connection: number
  loyalty: number

  role?: string

  notes?: string
}
