import type { AvailablityInfo } from "#/lib/system/types/availablityInfo.ts"
import type { SourceData } from "#/lib/system/types/sourceData.ts"

/**
 * Unified base interface for all items shared between character display
 * (GearData) and character building (GearItemFormState, ImplantFormState).
 */
export interface ItemData {
  id: string
  name: string
  notes?: string
  cost?: number
  availability?: AvailablityInfo
  source?: SourceData
}
