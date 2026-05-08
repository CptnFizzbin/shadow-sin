import type { AttributeKey } from "#/system/attributeKey"

import type { ImprovementType } from "./improvementType.ts"

export interface AttributeImprovement {
  type: ImprovementType.Attribute
  attribute: AttributeKey
  newRating: number
}
