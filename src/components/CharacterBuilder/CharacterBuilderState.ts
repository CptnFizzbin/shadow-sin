import type { AttrFormState } from "#/components/CharacterBuilder/Attributes/AttrFormState.ts"
import type { AwakenedFormState } from "#/components/CharacterBuilder/Resources/AwakenedFormState.ts"
import type { SkillsFormState } from "#/components/CharacterBuilder/Skills/SkillFormState.ts"
import type { ItemData } from "#/lib/system/ItemData.ts"
import type { LifestyleType } from "#/lib/system/LifestyleType.ts"
import type { MetatypeKey } from "#/lib/system/MetatypeData.ts"
import type { AttributeKey } from "#/lib/system/attributeKey.ts"
import type { AwakeningType } from "#/lib/system/awakeningType.ts"
import type { ContactData } from "#/lib/system/contactData.ts"
import type { QualityData } from "#/lib/system/qualityData.ts"

export interface CharacterBuilderState {
  characterId: string

  name: string
  alias: string
  lifestyle: LifestyleType
  lifestyleMonths: number
  gender?: string
  weight?: string
  height?: string
  age: number
  metatype: MetatypeKey
  awakening: AwakeningType

  attributes: {
    [AttributeKey.body]: AttrFormState
    [AttributeKey.agility]: AttrFormState
    [AttributeKey.reaction]: AttrFormState
    [AttributeKey.strength]: AttrFormState
    [AttributeKey.charisma]: AttrFormState
    [AttributeKey.intuition]: AttrFormState
    [AttributeKey.logic]: AttrFormState
    [AttributeKey.willpower]: AttrFormState
    [AttributeKey.edge]: AttrFormState
    [AttributeKey.magic]: AttrFormState
    [AttributeKey.essence]: AttrFormState
    [AttributeKey.resonance]: AttrFormState
  }

  qualities: QualityData[]

  skills: SkillsFormState

  awakened: AwakenedFormState

  gear: Record<string, ItemData>

  contacts: ContactData[]
}
