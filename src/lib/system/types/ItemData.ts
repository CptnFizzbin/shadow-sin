import type { AvailablityInfo } from "#/lib/system/types/availablityInfo.ts"
import type { SourceData } from "#/lib/system/types/sourceData.ts"

export interface ItemData {
  id: string
  name: string
  itemType: string

  description?: string
  cost?: number
  quantity?: number
  availability?: AvailablityInfo
  source?: SourceData

  parentId?: string
  childIds?: string[]
}
