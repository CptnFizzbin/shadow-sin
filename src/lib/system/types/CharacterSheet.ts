import type { AttributeKey } from "#/lib/system/types/attributeKey.ts"
import type { ContactData } from "#/lib/system/types/contactData.ts"
import type { QualityData } from "#/lib/system/types/qualityData.ts"

/**
 * Unified interface that represents the core character data shared between
 * character display (PlayerCharacterData) and character building
 * (CharacterFormState).
 *
 * By sharing this base interface both contexts expose the same attribute,
 * quality, and contact shapes, enabling hooks and selectors to be written
 * once and reused in either a display or builder store context.
 */
export interface CharacterSheet {
  /** Plain attribute values keyed by AttributeKey. */
  attributes: Record<AttributeKey, number>
  qualities: QualityData[]
  contacts: ContactData[]
}
