export interface BuilderGearData {
  id: string
  parentId?: string
  cost?: number
  type:
    | "weapons"
    | "armor"
    | "vehicles"
    | "devices"
    | "misc"
    | "sins"
    | "licenses"
    | "cyberware"
    | "implantMods"
}

export interface BuilderGearDataMap {
  [id: string]: BuilderGearData
}
