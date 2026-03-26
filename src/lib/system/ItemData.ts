import type { AvailablityInfo } from "#/lib/system/availablityInfo.ts"
import type { SourceData } from "#/lib/system/sourceData.ts"

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
