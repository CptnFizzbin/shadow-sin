import type { AttributeKey } from "#/lib/system/types/attributeKey.ts"
import type { ContactData } from "#/lib/system/types/contactData.ts"
import type { QualityData } from "#/lib/system/types/qualityData.ts"

/**
 * Minimal shared base for both the stored character sheet (CharacterSheet)
 * and the builder draft state (CharacterFormState). Provides the fields that
 * are structurally identical in both contexts so selectors can be written once
 * and reused across display and builder stores.
 */
export interface CharacterCore {
  /** Plain attribute values keyed by AttributeKey. */
  attributes: Record<AttributeKey, number>
  qualities: QualityData[]
  contacts: ContactData[]
}
