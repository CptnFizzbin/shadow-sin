import type { ItemData } from "#/lib/system/types/ItemData.ts"
import type {
  ImplantGrade,
  ImplantType,
} from "#/lib/system/types/gear/implantData.ts"

export interface ImplantFormState extends ItemData {
  cost: number
  essenceCost: number
  grade: ImplantGrade | string
  implantType: ImplantType | string
  location: string
}
