export interface FociData {
  id: string
  type: string

  attuement: string
  force: string

  source?: {
    book: string
    page: number
  }

  notes?: string
}
