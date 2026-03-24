import type { AttrLimits } from "#/components/Character/Form/AttrFormState.ts"
import type { AttributeKey } from "#/lib/system/types/attributeKey.ts"

export interface BuilderState {
  buildPoints: {
    total: number
    spent: {
      metatype: number
      qualities: number
      attributes: number
      skills: number
      gear: number
    }
  }
  attributeLimits: Record<AttributeKey, AttrLimits>
}

export const defaultBuilderState: Pick<BuilderState, "buildPoints"> = {
  buildPoints: {
    total: 400,
    spent: {
      metatype: 0,
      qualities: 0,
      attributes: 0,
      skills: 0,
      gear: 0,
    },
  },
}
