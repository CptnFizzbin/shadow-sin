import type { ItemData } from "#/lib/system/types/ItemData.ts"

export interface GearItemFormState extends ItemData {
  parentId?: string
  cost: number
}
