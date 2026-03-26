import type { AvailablityInfo } from "#/lib/system/availablityInfo.ts"
import type { SourceData } from "#/lib/system/sourceData.ts"

export interface GearItemFormState {
  id: string
  parentId?: string
  name: string
  cost: number
  quantity: number
  description?: string
  availability?: AvailablityInfo
  source?: SourceData
}
