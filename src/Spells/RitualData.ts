export enum RitualType {
  Anchored = "Anchored",
  MaterialLink = "Material Link",
  Minion = "Minion",
  Spell = "Spell",
  Spotter = "Spotter",
}

export interface RitualData {
  id: string
  ritual: true
  ritualTypes: RitualType[]
  threshold: number
}
