import type { AttributeKey } from "#/lib/system/types/attributeKey.ts"
import type { ContactData } from "#/lib/system/types/contactData.ts"
import type { QualityData } from "#/lib/system/types/qualityData.ts"

/**
 * Minimal shared base for both the stored character sheet (CharacterSheet)
 * and future contexts that need attribute/quality/contact data. After the
 * removal of CharacterFormState, CharacterSheet is the only concrete type
 * that extends this interface.
 */
export interface CharacterCore {
  /** Plain attribute values keyed by AttributeKey. */
  attributes: Record<AttributeKey, number>
  qualities: QualityData[]
  contacts: ContactData[]
}
