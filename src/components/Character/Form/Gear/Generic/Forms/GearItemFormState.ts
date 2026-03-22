import type { AvailablityInfo } from "#/lib/system/types/availablityInfo.ts"
import type { SourceData } from "#/lib/system/types/sourceData.ts"

export interface GearItemFormState {
  id: string
  parentId?: string
  name: string
  cost: number
  description?: string
  availability?: AvailablityInfo
  source?: SourceData
}
