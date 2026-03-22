import type { AvailablityInfo } from "#/lib/system/types/availablityInfo.ts"
import {
  ImplantGrade,
  ImplantType,
} from "#/lib/system/types/gear/implantData.ts"
import type { SourceData } from "#/lib/system/types/sourceData.ts"

export type ImplantFormRestriction = "none" | "restricted" | "forbidden"

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

export const defaultImplantFormValues: ImplantFormState & {
  availabilityRating: number
  restriction: ImplantFormRestriction
  sourceBook: string
  sourcePage: number
} = {
  id: "",
  name: "",
  cost: 0,
  essenceCost: 0,
  grade: ImplantGrade.standard,
  implantType: ImplantType.cyberware,
  location: "",
  description: "",
  availabilityRating: 0,
  restriction: "none",
  sourceBook: "",
  sourcePage: 0,
}
