import type { AvailablityInfo } from "#/lib/system/availablityInfo.ts"
import type {
  ImplantGrade,
  ImplantType,
} from "#/lib/system/gear/implantData.ts"
import type { SourceData } from "#/lib/system/sourceData.ts"

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
