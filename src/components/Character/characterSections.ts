export interface CharacterSection {
  readonly label: string
  readonly to: string
}

export const characterSections: readonly CharacterSection[] = [
  { label: "About", to: "about" },
  { label: "Defense", to: "defense" },
  { label: "Offense", to: "offense" },
  { label: "Cyberware", to: "gear" },
  { label: "Skills", to: "skills" },
  { label: "Spells", to: "spells" },
  { label: "Drones", to: "drones" },
  { label: "Vehicles", to: "vehicles" },
  { label: "Contacts", to: "contacts" },
  { label: "Qualities", to: "qualities" },
  { label: "Notes", to: "notes" },
]
