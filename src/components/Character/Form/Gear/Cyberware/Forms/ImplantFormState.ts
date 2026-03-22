import type { AvailablityInfo } from "#/lib/system/types/availablityInfo.ts"
import type {
  ImplantGrade,
  ImplantType,
} from "#/lib/system/types/gear/implantData.ts"
import type { SourceData } from "#/lib/system/types/sourceData.ts"

export interface ImplantFormState {
  id: string
  name: string
  cost: number
  essenceCost: number
  grade: ImplantGrade | string
  implantType: ImplantType | string
  location: string
  description?: string
  availability?: AvailablityInfo
  source?: SourceData
}
