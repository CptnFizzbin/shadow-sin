export interface SpriteData {
  id: string
  name: string
  force: number
  services: {
    max: number
    used: number
  }

  bound?: boolean

  source?: {
    book: string
    page: number
  }

  notes?: string

  damage: {
    physical: number
    stun: number
  }
}
